import { cava } from "services/cava"



const CavaModule = () => {
    return {
        component: Widget.Box({
                    setup: self => self.hook(cava, ()=> {
                        console.log(cava.bind())
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
            }),
         
        isVisible: true,
      
    };

}

export { CavaModule }
// const box = 


// })
// })