const notifHasImg = (notif) => {
  return notif.image !== undefined && notif.image.length;
};

export { notifHasImg };
