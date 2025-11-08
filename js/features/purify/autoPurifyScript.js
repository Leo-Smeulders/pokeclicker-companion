intervalMap.set(
  "autoPurifyInterval",
  setInterval(() => {
    const canPurify = App.game.purifyChamber.canPurify();

    if (canPurify) {
      App.game.purifyChamber.purify();
    }
  }, 1000)
);
