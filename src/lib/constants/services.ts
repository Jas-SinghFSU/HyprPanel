import Hyprland from 'gi://AstalHyprland';
export const hyprland = Hyprland.get_default();

import AstalMpris from 'gi://AstalMpris?version=0.1';
export const mpris = AstalMpris.get_default();

import AstalWp from 'gi://AstalWp?version=0.1';
const wireplumber = AstalWp.get_default() as AstalWp.Wp;
export const audio = wireplumber.audio;

import AstalNetwork from 'gi://AstalNetwork?version=0.1';
export const network = AstalNetwork.get_default();
