import { bash, dependencies, sh } from "lib/utils"
import { exec } from 'utils/exec.ts'

// const input = Utils.execAsync('cava').then(out => print(out));
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import { Bytes, SIZEOF_LONG, SIZEOF_SIZE_T } from "types/@girs/glib-2.0/glib-2.0.cjs";
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

    #bar_number = 50;
    #byte_size = 255;
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
            bufferSize: this.#bar_number * 255,
            close_base_stream: true,
        });
    }

    private get_stderr(proc : Gio.Subprocess){
        return new Gio.DataInputStream({
            base_stream: proc.get_stderr_pipe(),
            close_base_stream: true,
        });
    }
    
    // private readStream(stream: Gio.DataInputStream, callback: (out: Uint8Array) => void) {
    //     stream.read_bytes_async(this.#bar_number, GLib.PRIORITY_LOW, null, (_, res) => {
    //         try{
    //             const output = _.read_bytes_finish(res);
    //             const data = output.get_data() ?? new Uint8Array;
    //             if(data.length >= this.#bar_number){
    //                 callback(data);
    //             }
    //             this.readStream(stream, callback);
    //         }catch(e){}
                
            
    //     });
    // }

     private readStream(stream: Gio.DataInputStream, callback: (out) => void) {
        stream.read_line_async(GLib.PRIORITY_LOW, null, (_, res) => {
            try{
                let output = Array.from(((_.read_line_finish_utf8(res)[0] ?? "").split(';')),
                (value) => {
                    try{
                        if(Number.parseInt(value) !== null){
                            return Number.parseInt(value);

                        }
                    } catch(e){}
                    
                } 
                );
const data = output
                console.log(data.length);
                if(data.length === this.#bar_number){
                    callback(data);
                }
                this.readStream(stream, callback);
            }catch(e){}
                
            
        });
    }


    private  OnChange = (array) => {
        // this.#barArray = Array.from(array, (value) => 
        //      ((value * 10) / 255)
        // )
        this.#barArray = array;
        console.log(this.#barArray.length)
        this.changed('bar-array')
        this.emit('bar-changed', this.#barArray)
    }


    private normalizeBarSize = (array : Uint8Array) => {
    }
    

    constructor() {
        super();
        
        const process = this.proc()
       
        console.log(process.get_identifier())
        this.stdout = this.get_stdout(process);
        this.stderr = this.get_stderr(process);
        this.readStream(this.stdout, this.OnChange);


    }
}

    
export const cava = new Cava;

            