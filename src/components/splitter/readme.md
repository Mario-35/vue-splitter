Splitter by Mario Ada for Iness @2019

## Permet de créer des blocs séparées par un splitter permettant le redimensionnement des zones, le click sur le bouton central permet de cacher la zone a droite ou dessous.

  tag panel
    layout "vertical" ou  "horizontal" indiquand le sens des paneaux
  <panel layout="vertical">
    Ensuite une div avec un style tout en pourcentage
    :style="{ width: largeur de depart servant aussi de vaseur lor du click sur le spltter, maxWidth: largeur maximum, minWidth: largeur minimum }" (pour du vertical)
    <div :style="{ width: '33%', maxWidth: '66%', minWidth: '15%' }">
      <panel class="horizontal-panel" layout="horizontal">
        <div :style="{ height: '75%', maxHeight: '80%', minHeight: '25%', overflow: 'auto' }">
          [ contenu ]
        </div>
        la div panel-resizer insert un splitter a cette endroit
        <panel-resizer></panel-resizer>
        il est important que les tailles soit correctement calculées au départ pour que le flexbox fasse le job.
        A cet endroit il est important d'indiquer l'overflow.
        <div class="after-splitter" :style="{ height: '25%', maxHeight: '75%', minHeight: '20%', overflow: 'hidden'}" >
          [ contenu ]
        </div>
      </panel>
    </div>
    <panel-resizer></panel-resizer>
    ## la classe toggle indique que la zone peu ëtre cachée
    <div  class="toggle" :style="{ width: '66%', maxWidth: '85%', minWidth: '33%', overflow: 'hidden'}">
      [ contenu ]
    </div>
  </panel>

  premiere version le 21/03/2019