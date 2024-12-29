import { Variable, bind } from "astal";
import { Astal } from "astal/gtk3";
import { cavaService, mprisService } from "src/lib/constants/services";
import { BarBoxChild } from "src/lib/types/bar";
import { Module } from "../../shared/Module";
import { inputHandler } from "../../utils/helpers";

const {
  icon,
  label,
  showActiveOnly,
  bars,
  channels,
  framerate,
  samplerate,
  leftClick,
  rightClick,
  middleClick
} = options.bar.customModules.cava;

const isVis = Variable(!showActiveOnly.get());
Variable.derive([bind(showActiveOnly), bind(mprisService, 'players')], (showActive, players) => {
  isVis.set(!showActive || players?.length > 0);
});

Variable.derive([bind(bars)], bars => cavaService.set_bars(bars));
Variable.derive([bind(channels)], channels => cavaService.set_channels(channels));
Variable.derive([bind(framerate)], framerate => cavaService.set_framerate(framerate));
Variable.derive([bind(samplerate)], samplerate => cavaService.set_samplerate(samplerate));

const blockCharacters = [' ', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

export const Cava = (): BarBoxChild => {
  const labelBinding = Variable.derive([bind(cavaService, 'values')],
    values => values.map((v: number) => blockCharacters[Math.round(v * blockCharacters.length)]).join(''));

  return Module({
    isVis,
    label: labelBinding(),
    showLabelBinding: bind(label),
    textIcon: bind(icon),
    tooltipText: labelBinding(),
    boxClass: 'cava',
    props: {
      setup: (self: Astal.Button) => {
        inputHandler(self, {
          onPrimaryClick: {
            cmd: leftClick,
          },
          onSecondaryClick: {
            cmd: rightClick,
          },
          onMiddleClick: {
            cmd: middleClick,
          },
        });
      },
      onDestroy: () => {
        labelBinding.drop();
      },
    },
  });
}