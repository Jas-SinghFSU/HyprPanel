import { bash, dependencies, sh } from "lib/utils"
import { exec } from 'utils/exec.ts'

// const input = Utils.execAsync('cava').then(out => print(out));
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
const audio = await Service.import("mpris");


class Cava extends Service {
    static {
        Service.register(
            this, 
            {
                "bar-changed" : ['jsobject']
            }, 
            {
            "bar-array" : ['jsobject', "r"]
            }
        );
    }

    #barArray = new Array<number>;
    private stdout : Gio.DataInputStream;
    private stderr : Gio.DataInputStream;

    private proc(): Gio.Subprocess {
        return Gio.Subprocess.new(['cava'],
            Gio.SubprocessFlags.STDOUT_PIPE |
            Gio.SubprocessFlags.STDERR_PIPE,
        ) 
    }

    get bar_array(){
        return this.#barArray
    }

        // private _instance?: Gio.Subprocess;
        // private _inputStream: Gio.InputStream | null;
        // private _bars: Uint8Array = new Uint8Array;
    private get_stdout(proc : Gio.Subprocess){
        return new Gio.DataInputStream({
            base_stream: proc.get_stdout_pipe(),
            close_base_stream: true,
        });
    }

    private get_stderr(proc : Gio.Subprocess){
        return new Gio.DataInputStream({
            base_stream: proc.get_stderr_pipe(),
            close_base_stream: true,
        });
    }
    
    private readStream(stream: Gio.DataInputStream, callback: (out: Uint8Array) => void) {
        stream.read_bytes_async(20, GLib.PRIORITY_LOW, null, (_, res) => {
            try{
                const output = stream?.read_bytes_finish(res);
                console.log(output.get_size())
                const data = output.toArray() ?? new Uint8Array;
                    callback(data);
                    this.readStream(stream, callback);
            }catch(e){}
                
            
        });
    }

    private  OnChange = (array : Uint8Array) => {
        this.#barArray = array.length === 20 ? Array.from(array) : this.#barArray;
        this.changed('bar-array')
        this.emit('bar-changed', this.#barArray)
    }

    constructor() {
        super();
        
        const process = this.proc()
       
        console.log(process.get_identifier())
        this.stdout = this.get_stdout(process);
        this.stderr = this.get_stderr(process);
        this.stdout.set_buffer_size(256 * 20)
        this.readStream(this.stdout, this.OnChange);


    }
}

    
export const cava = new Cava;

            