import { bash, dependencies, sh } from "lib/utils"
import { exec } from 'utils/exec.ts'

// const input = Utils.execAsync('cava').then(out => print(out));

const input = Variable('initial-value', {
    // listen is what will be passed to Utils.subprocess, so either a string or string[]
    listen: 'cava'
});

// const input = Variable('cava', {
//     // listen is what will be passed to Utils.subprocess, so either a string or string[]
//    listen: ['bash', '-c', 'cava']
//     // poll is a [interval: number, cmd: string[] | string, transform: (string) => any]
// //     // cmd is what gets passed to Utils.execAsync
// //   // poll: [10, 'cava', out => out.toString()],

// });


const box = Widget.Box({

    setup: self => self.hook(input, ()=> {
        const f = input.value.split(';').map(Number).map(x => x / 1000)

        self.children = f.map(i => {
                // return Widget.Label({
                //     label: i.toString()
                // })
                return Widget.LevelBar({
                    class_name: "stats-bar",
                    inverted: true,
                    width_request: 10,
                    vexpand: true,
                    vertical: true,
                    hpack: "center",
                    bar_mode: "continuous",
                    max_value: 1,
                    value: i
                })
            // return Widget.LevelBar({
            //     width_request: 10,
            //     max_value: 100,
            //     min_value: 0,
            //     class_name: "stats-bar",
            //     vexpand: true,
            //     vertical: true,
            //     value: 50
                    
            // })
    
    })


})
})


export { box };


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