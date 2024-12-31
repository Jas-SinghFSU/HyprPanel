import options from "src/options";
import { Module } from "../../shared/Module";
import { inputHandler, throttleInput } from "../../utils/helpers";
import { BarBoxChild } from "src/lib/types/bar";
import { checkWarpStatus, isWarpConnect, toggleWarp } from "./helpers";
import { bind, Variable } from "astal";
import { Astal } from "astal/gtk3";
import { FunctionPoller } from "src/lib/poller/FunctionPoller";

const {
    label,
    pollingInterval,
    onIcon,
    offIcon,
    onLabel,
    offLabel,
    rightClick,
    middleClick,
    scrollUp,
    scrollDown,
} = options.bar.customModules.warp;

const dummyVar = Variable(undefined);

checkWarpStatus();

const warpPoller = new FunctionPoller<undefined, []>(dummyVar, [], bind(pollingInterval), checkWarpStatus);

warpPoller.initialize('warp');

const thorttledToggleWarp = throttleInput(() => toggleWarp(isWarpConnect), 1000);

export const Warp = (): BarBoxChild => {
    const iconBinding = Variable.derive([bind(isWarpConnect), bind(onIcon), bind(offIcon)], (active, onIcn, offIcn) => {
        return active ? onIcn : offIcn;
    })

    const tooltipBinding = Variable.derive([isWarpConnect], (active) => {
        return active ? 'Connect' : "Disconnect";
    });

    const labelBinding = Variable.derive([bind(isWarpConnect), bind(onLabel), bind(offLabel)], (active, onLbl, offLbl) => {
        return active ? onLbl : offLbl;
    });

    const warpModule = Module({
        textIcon: iconBinding(),
        tooltipText: tooltipBinding(),
        boxClass: 'warp',
        label: labelBinding(),
        showLabelBinding: bind(label),
        props: {
            setup: (self: Astal.Button) => {
                inputHandler(self, {
                    onPrimaryClick: {
                        fn: () => {
                            thorttledToggleWarp();
                        },
                    },
                    onSecondaryClick: {
                        cmd: rightClick,
                    },
                    onMiddleClick: {
                        cmd: middleClick,
                    },
                    onScrollUp: {
                        cmd: scrollUp,
                    },
                    onScrollDown: {
                        cmd: scrollDown,
                    },
                });
            },
            onDestroy: () => {
                iconBinding.drop();
                tooltipBinding.drop();
                labelBinding.drop();
            },
        },
    });

    return warpModule;
};
