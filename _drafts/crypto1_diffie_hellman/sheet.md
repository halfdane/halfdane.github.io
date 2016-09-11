---
title: "Diffie-Hellman Game Calculator"
template: minimal.jade
---
 
<link href="https://fonts.googleapis.com/css?family=Merriweather|Cousine" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Tangerine">
<style>
  body {
    font-family: Cousine, monospace;
  }
  .container {
    width: 90%;
    padding-left: 5%;
  }
  fieldset {
    border: 1px black solid; 
    margin-bottom: 1em;
    text-align: left;
  }
  legend {
    width: 60%;
    font-family: Merriweather, serif;
    border: 1px black solid; 
    margin-left: 1em; 
    padding: 0.2em 0.8em
  }
  .label {
    text-align: right;
    width: 35%;
    float: left;
    padding-right: 0.6em;
  }
  .content {
    overflow: hidden;
    padding-top: 0.8em;
  }
  .hline { 
    width: 80%; 
    height:1px; 
    background: #000;
  }
  .sub {
    font-size: 0.5em;
  }
</style> 
 
<div class="container">
    <fieldset>
        <legend>Geheim</legend>
        <div class="label">Private Key "a":</div>
        <div class="content">
            <div class="hline"></div>
            <div class="sub">Zufallszahl</div>
        </div>
    </fieldset>

    <fieldset>
        <legend>Öffentlich (einer bestimmt)</legend>
        <div class="label">Basis "g":</div>
        <div class="content">
            <div class="hline"></div>
            <div class="sub">Zufallszahl</div>
        </div>
        <div class="label">Gruppe "p":</div>
        <div class="content">
            <div class="hline"></div>
            <div class="sub">Primzahl</div>
        </div>
    </fieldset>

    <fieldset>
        <legend>Öffentlich (ausrechnen)</legend>
        <div class="label">Public Key "A":</div>
        <div class="content">
            <div class="hline"></div>
            <div class="sub">g^a mod p</div>
        </div>
    </fieldset>

    <fieldset>
        <legend>Bekommen</legend>
        <div class="label">Public Key "B":</div>
        <div class="content">
            <div class="hline"></div>
            <div class="sub">&nbsp;</div>
        </div>
    </fieldset>

    <fieldset>
        <legend>Shared Key</legend>
        <div class="label">Shared Key "K":</div>
        <div class="content">
            <div class="hline"></div>
            <div class="sub">B^a mod p</div>
        </div>
    </fieldset>

    <fieldset>
        <legend>Verschlüsseln</legend>
        <div class="label">Ciphertext "C":</div>
        <div class="content">
            <div class="hline"></div>
            <div class="sub">Pin + K</div>
        </div>
    </fieldset>

    <fieldset>
        <legend>Entschlüsseln</legend>
        <div class="label">Plaintext:</div>
        <div class="content">
            <div class="hline"></div>
            <div class="sub">C - K</div>
        </div>
    </fieldset>
</div>