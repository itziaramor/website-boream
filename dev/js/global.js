window.BOREAM = {};

BOREAM.W = window;
BOREAM.D = document;
BOREAM.E = BOREAM.D.documentElement;
BOREAM.G = BOREAM.D.getElementsByTagName('body')[0];
BOREAM.X = BOREAM.W.innerWidth || BOREAM.E.clientWidth || BOREAM.G.clientWidth;
BOREAM.Y =
  BOREAM.W.innerHeight || BOREAM.E.clientHeight || BOREAM.G.clientHeight;

BOREAM.isIE11 = false;
