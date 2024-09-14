export type InputDevices = Button<Box<Box<Label<Attribute>, Attribute>, Attribute>, Attribute>[];

type DummyDevices = Button<Box<Box<Label<Attribute>, Attribute>, Attribute>, Attribute>[];
type RealPlaybackDevices = Button<Box<Box<Label<Attribute>, Attribute>, Attribute>, Attribute>[];
export type PlaybackDevices = DummyDevices | RealPlaybackDevices;
