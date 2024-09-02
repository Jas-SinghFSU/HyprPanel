import { cava } from "services/Cava"
import GObject from "types/@girs/gobject-2.0/gobject-2.0";

const CavaModule = () => {
    return Widget.Box({
        class_name: "bar_item_box_visible",

        hexpand: true,
        vexpand: true,
        visible: true,
        setup: self => self.hook(cava, (self)=> {
           // console.log(cava.bar_array.length)
            
            self.children = cava.bar_array.map(i => {
                    return Widget.LevelBar({
                        class_name: "stats-bar",
                        visible: true,
                        inverted: true,
                        width_request: 3,
                        vexpand: true,
                        vertical: true,
                        hpack: "center",
                        bar_mode: "continuous",
                        max_value: 8,
                        value: i
                    })
                })
             })
        
    })
}

// const CavaModule = () => {
//     return {
//         component: Widget.Box({
//                     setup: self => self.hook(cava, (self)=> {
//                         const f = cava.bar_array as any

//                         self.children = f.map(i => {
//                                 // return Widget.Label({
//                                 //     label: i.toString()
//                                 // })
//                                 return Widget.LevelBar({
//                                     class_name: "stats-bar",
//                                     inverted: true,
//                                     width_request: 10,
//                                     vexpand: true,
//                                     vertical: true,
//                                     hpack: "center",
//                                     bar_mode: "continuous",
//                                     max_value: 1,
//                                     value: i
//                                 })
//                             return Widget.LevelBar({
//                                 width_request: 10,
//                                 max_value: 100,
//                                 min_value: 0,
//                                 class_name: "stats-bar",
//                                 vexpand: true,
//                                 vertical: true,
//                                 value: 50
                                    
//                             })
                    
//                     })
//                 })
//             }),
    
         
//         isVisible: true,
      
//     };

// }

export { CavaModule }
// const box = 


// })
// })