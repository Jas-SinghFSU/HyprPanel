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

    private barArray = new Uint8Array;
    private stdout : Gio.DataInputStream;
    private stderr : Gio.DataInputStream;

    private proc(): Gio.Subprocess {
        return Gio.Subprocess.new(['cava'],
            Gio.SubprocessFlags.STDOUT_PIPE |
            Gio.SubprocessFlags.STDERR_PIPE,
        ) 
    }

    get bar_array(){
        return this.barArray
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
        this.barArray = array
        this.emit('changed');
        this.notify('bar-array')
    }

    constructor() {
        super();

        
        const process = this.proc()
       

        this.stdout = this.get_stdout(process);
        this.stderr = this.get_stderr(process);
        
        this.readStream(this.stdout, this.OnChange);


    }
}

    
            
        
            //  console.log(out);
            // this._instance = Gio.Subprocess.new(['cava'], Gio.SubprocessFlags.STDOUT_PIPE);
            // this._inputStream = this._instance.get_stdout_pipe();
            // let barline = this.readStream(this._inputStream);
        
            // console.log("ff" + barline);


    // export function subprocess(
    //     argsOrCmd: Args & { bind?: Gtk.Widget } | string | string[],
    //     out: (stdout: string) => void = print,
    //     err: (stderr: string) => void = err => console.error(Error(err)),
    //     bind?: Gtk.Widget,
    // ) {
    //     const p = proc(argsOrCmd);
    
       
    
      
    
        
    
    //     const onErr = Array.isArray(argsOrCmd) || typeof argsOrCmd === 'string'
    //         ? err
    //         : argsOrCmd.err;
    
    //     const onOut = Array.isArray(argsOrCmd) || typeof argsOrCmd === 'string'
    //         ? out
    //         : argsOrCmd.out;
    
    //     readStream(stdout, onOut ?? out);
    //     readStream(stderr, onErr ?? err);
    
    //     return Object.assign(p, {
    //         write(str: string): void {
    //             stdin.write_all(new TextEncoder().encode(str), null);
    //         },
    //         writeAsync(str: string): Promise<void> {
    //             return new Promise((resolve, reject) => {
    //                 stdin.write_all_async(
    //                     new TextEncoder().encode(str),
    //                     GLib.PRIORITY_DEFAULT,
    //                     null,
    //                     (stdin, res) => {
    //                         stdin.write_all_finish(res)[0]
    //                             ? resolve()
    //                             : reject();
    //                     },
    //                 );
    //             });
    //         },
    //     });
    // }

     

// const input = Variable('initial-value', {
//     // listen is what will be passed to Utils.subprocess, so either a string or string[]
//     listen: 'cava'
// });

// // const input = Variable('cava', {
// //     // listen is what will be passed to Utils.subprocess, so either a string or string[]
// //    listen: ['bash', '-c', 'cava']
// //     // poll is a [interval: number, cmd: string[] | string, transform: (string) => any]
// // //     // cmd is what gets passed to Utils.execAsync
// // //   // poll: [10, 'cava', out => out.toString()],

// // });





export const cava = new Cava;


// class CavaService extends Service {

//     static {

//         Service.register(
//             this, 
//             {
//                 'cava-input' : ['float'],
//             },
//             {
//                 'bar-value' : ['int', 'r'],
//             },
//         );


//         data = input


//     }


// }