---
layout: post
title: "Mehrere Schrittmotoren mit RasPi kontrollieren"
description: ""
category: embedded
tags: [python, raspi, stepper]
group: post
image: stepper_raspi.png
---
Hört sich erstmal nicht so schwierig an, mehrere Schrittmotoren zu kontrollieren: das ist wie ein Schrittmotor, nur mehr.
Allerdings kann man nicht einfach parallel laufende Prozesse für je einen Motor laufen lassen, weil die Taktung jeweils unterschiedlich sein kann und die Synchronisierung der Motoren auseinander läuft.

Schrittmotoren werden ja betrieben, indem auf ihren Leitungen in einer bestimmten Reihenfolge Strom gelegt oder abgeschaltet wird.
Die erste Belegung der vier Leitungen eines Schrittmotors (ja, die meisten Schrittmotoren haben vier Signalleitungen, unabhängig davon ob sie unipolar oder bipolar sind) ist üblicherweise
```
AUS, AN, AN, AUS.
```

Danach folgen die Belegungen
```
