const getIcon = (audioVol, isMuted) => {
  const speakerIcons = {
    101: "audio-volume-overamplified-symbolic",
    66: "audio-volume-high-symbolic",
    34: "audio-volume-medium-symbolic",
    1: "audio-volume-low-symbolic",
    0: "audio-volume-muted-symbolic",
  };

  const inputIcons = {
    66: "microphone-sensitivity-high-symbolic",
    34: "microphone-sensitivity-medium-symbolic",
    1: "microphone-sensitivity-low-symbolic",
    0: "microphone-disabled-symbolic",
  };

  const icon = isMuted
    ? 0
    : [101, 66, 34, 1, 0].find((threshold) => threshold <= audioVol * 100);

  return {
    spkr: speakerIcons[icon],
    mic: inputIcons[icon],
  };
};

export { getIcon };
