(function () {
  var ns = $.namespace('pskl.service');
  ns.PaletteService = function () {
    this.palettes = [];
    this.localStorageService = window.localStorage;
  };

  ns.PaletteService.prototype.init = function () {};

  ns.PaletteService.prototype.getPalettes = function () {
    var palettesString = this.localStorageService.getItem('piskel.palettes');
    return JSON.parse(palettesString) || [];
  };

  ns.PaletteService.prototype.getPaletteById = function (paletteId) {
    var palettes = this.getPalettes();
    return this.findPaletteInArray_(paletteId, palettes);
  };

  ns.PaletteService.prototype.savePalette = function (palette) {
    var palettes = this.getPalettes();
    var existingPalette = this.findPaletteInArray_(palette.id, palettes);
    if (existingPalette) {
      var currentIndex = palettes.indexOf(existingPalette);
      palettes.splice(currentIndex, 1, palette);
    } else {
      palettes.push(palette);
    }

    this.savePalettes_(palettes);

    $.publish(Events.SHOW_NOTIFICATION, [{"content": "Palette " + palette.name + " successfully saved !"}]);
    window.setTimeout($.publish.bind($, Events.HIDE_NOTIFICATION), 2000);
  };

  ns.PaletteService.prototype.deletePaletteById = function (id) {
    var palettes = this.getPalettes();
    var filteredPalettes = palettes.filter(function (palette) {
      return palette.id !== id;
    });

    this.savePalettes_(filteredPalettes);
  };

  ns.PaletteService.prototype.savePalettes_ = function (palettes) {
    this.localStorageService.setItem('piskel.palettes', JSON.stringify(palettes));
    $.publish(Events.PALETTE_LIST_UPDATED);
  };

  ns.PaletteService.prototype.findPaletteInArray_ = function (paletteId, palettes) {
    var match = null;

    palettes.forEach(function (palette) {
      if (palette.id === paletteId) {
        match = palette;
      }
    });

    return match;
  };
})();