import loginSession from '../../services/loginSession';
import { passwordInput } from './input/index';
import { profileName } from './profile/name';
import { profilePicture } from './profile/picture';

console.log(loginSession.getUsers());
console.log(loginSession.getSessions());
console.log(loginSession.getProfilePicture('jaskirs'));

export default Widget.Box({
    class_name: 'auth',
    expand: true,
    vertical: true,
    children: [profilePicture(), profileName(), passwordInput()],
});
