import { bash, dependencies, sh } from "lib/utils"
import { exec } from 'utils/exec.ts'

// const input = Utils.subprocess(
//     'cava',
//     (output) => print(output),
//     (err) => logError(err),
// )

const input = Variable('initial-value', {
    // listen is what will be passed to Utils.subprocess, so either a string or string[]
    listen: ['cava'],

    // poll is a [interval: number, cmd: string[] | string, transform: (string) => any]
    // cmd is what gets passed to Utils.execAsync
    poll: [10, 'cava', out => out],

});


export { input };


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