import { bash, dependencies, sh } from "lib/utils"
import { exec } from 'utils/exec.ts'

// const input = Utils.execAsync('cava').then(out => print(out));
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Services from "types/service"
import { ByteArray, PRIORITY_LOW } from "types/@girs/glib-2.0/glib-2.0.cjs";
import { read_line } from "types/@girs/pango-1.0/pango-1.0.cjs";
import { DataInputStream } from "types/@girs/gio-2.0/gio-2.0.cjs";
import service from "directoryMonitorService";
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
        stream.read_bytes_async(10, GLib.PRIORITY_DEFAULT, null, (_, res) => {
            const output = stream?.read_bytes_finish(res);
            try{
                const data = output.get_data() ?? new Uint8Array;
                callback(data);
             
                this.readStream(stream, callback);
            }catch(e){}
                
            
        });
    }

    private  OnChange = (array : Uint8Array) => {
        this.#barArray = Array.from(array)
        this.changed('bar-array')
        this.emit('bar-changed', this.#barArray)
    }

    constructor() {
        super();

        
        const process = this.proc()
       

        this.stdout = this.get_stdout(process);
        this.stderr = this.get_stderr(process);
        
        this.readStream(this.stdout, this.OnChange);


    }
}

    
export const cava = new Cava;

            