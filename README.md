# vue-splitter

# Usage
    Have panels with resize, hide, acivate capabilities,

## exemple : 
```
    <panel-splitter layout="vertical" startValue="66" minValue="25" maxValue="75">
      <composant1 slot="prev-panel" />
      <composant2 slot="next-panel" />
    </panel-splitter>
```
This example indicate a splitter in verticale disposition start at 60% with a max of 25% and min at 75%.
inject contents in the two parts with slots : prev-panel and next-panel.

# props

    hasparent : boolean if this splitter is inside another splitter, is use to prevent resize conflict.
    layout : horizontal or vertical.
    },
    startValue : strating percentage of prev-pane, the first panel.
    maxValue : maximum percentage the first panel.
    minValue : minimum percentage the first panel.
        The second panel is : 100 - first panel.
    mode : minimize, active, deactivate and resize.
      minimize : the second panel is hide and clicking on up arrow reveal it.
      active : the second panel is visible and clicking on up arrow hide it.
      deactivate : the second panel and resizer are hide, only coding reveal it (this.myMode).
      resize : click on resize to startValue.

## exemple nested : 
```
  <panel-splitter layout="vertical" startValue="66" minValue="25" maxValue="75" mode="minimize">
      <composant1 slot="prev-panel" />
      <composant2 slot="next-panel" />
  </panel-splitter>
```
  component 1 content :
```
    <panel-splitter layout="horizontal" mode="active" startValue="33" minValue="15" maxValue="85" hasparent>
      <composant3 slot="prev-panel" />
      <composant4 slot="next-panel" />
  </panel-splitter>
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```
@2019 by adam mario
