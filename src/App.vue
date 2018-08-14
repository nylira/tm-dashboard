<template>
  <div id="app">
    <nav>
      <router-link to="/">Voyager</router-link>
      <router-link to="/tendermint">Tendermint Core</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style src="./styles/app.styl" lang="stylus"></style>
<style>
nav {
  position: fixed;
  top: 0;
  right: 0;
  padding: 0.25rem;
  background: var(--app-nav);
}
nav a {
  display: inline-block;
  border: 2px solid var(--bc);
  padding: 0 0.5rem;
  line-height: 2rem;
  color: var(--bright);
  margin: 0.25rem;
}
nav a.router-link-exact-active {
  background: var(--secondary);
}
.chart-container {
  background: var(--app-fg);
  width: 100vw;
  height: 200px;
}
.pie-chart-container {
  width: 400px;
  height: 400px;
}
</style>
