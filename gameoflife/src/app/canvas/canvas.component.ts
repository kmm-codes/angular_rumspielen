import { Component, OnInit } from '@angular/core';
import { isFormArray } from '@angular/forms';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { GolsettingsComponent } from '../golsettings/golsettings.component';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  data: boolean[][];
  running = false;
  constructor() {
    this.data = createSquareMatrix(GolsettingsComponent.fieldSize, true);
  }
  get fieldSize() {
    return GolsettingsComponent.fieldSize;
  }
  set fieldSize(size: number) {
    GolsettingsComponent.fieldSize = size
  }
  get refreshIntervalMs() {
    return GolsettingsComponent.refreshIntervalMs
  }
  set refreshIntervalMs(interval: number) {
    GolsettingsComponent.refreshIntervalMs = interval
  }
  makePlayfield() {
    this.data = createSquareMatrix(GolsettingsComponent.fieldSize, true);
    this.running = false;
  }
  makeEmptyField() {
    this.data = createSquareMatrix(GolsettingsComponent.fieldSize, false);
    this.running = false;
  }
  async engine() {
    while (true) {
      if (this.running) {
        this.step();
      }
      await delay(GolsettingsComponent.refreshIntervalMs);
    }
  }

  step() {
    let killed = 0;
    let born = 0;
    let rowIndex = 0;
    let data = this.data;
    var newData = this.data.map(function (arr) {
      return arr.slice();
    });
    this.data.forEach(function (row) {

      let colIndex = 0;
      row.forEach(function (col) {
        let numNeighbors = 0;
        //prüfen ob Zelle lebt
        let cellIsAlive = isAlive(rowIndex, colIndex, data)
        /*let cellIsAliveStr = "tot"
        if (cellIsAlive > 0) {
          cellIsAliveStr = "lebending"
        }
        */
        //Zelle links
        numNeighbors += isAlive(rowIndex, colIndex - 1, data)
        //Zelle oben links
        numNeighbors += isAlive(rowIndex - 1, colIndex - 1, data)
        //Zelle rechts
        numNeighbors += isAlive(rowIndex, colIndex + 1, data)
        //Zelle oben rechts
        numNeighbors += isAlive(rowIndex - 1, colIndex + 1, data)
        //Zelle oben
        numNeighbors += isAlive(rowIndex - 1, colIndex, data)
        //Zelle unten
        numNeighbors += isAlive(rowIndex + 1, colIndex, data)
        //Zelle unten links
        numNeighbors += isAlive(rowIndex + 1, colIndex - 1, data)
        //Zelle unten rechts
        numNeighbors += isAlive(rowIndex + 1, colIndex + 1, data)

        if (numNeighbors > 0) {
          //console.log(`Die Zelle ${rowIndex},${colIndex} ist ${cellIsAliveStr} und hat ${numNeighbors} lebende Nachbarn`)
        }

        //A living cell surrounded by less than 2 living cells will die.
        if (cellIsAlive && numNeighbors < 2) {
          newData[rowIndex][colIndex] = false;
          killed++;
        }
        //A living cell surrounded by more than 3 living cells will also die.
        if (cellIsAlive && numNeighbors > 3) {
          newData[rowIndex][colIndex] = false;
          killed++;
        }
        //A dead cell surrounded by 3 living cells will be reborn.
        if (!cellIsAlive && numNeighbors === 3) {
          //console.log(`Erwecke Zelle ${rowIndex},${colIndex} zum leben`)
          newData[rowIndex][colIndex] = true;
          born++;
        }

        colIndex++;
      })
      rowIndex++;
    });

    if (born === 0 && killed === 0) {
      this.running = false;
    }
    this.data = newData;
  }

  toggleField(rowindex: number, colindex: number) {
    this.data[rowindex][colindex] = !this.data[rowindex][colindex]
  }
  startClicked() {
    this.running = !this.running;
  }

  ngOnInit(): void {
    this.engine();
  }
}
function isAlive(rowIndex: number, colIndex: number, data: boolean[][]): number {
  //console.log("check isAlive for " + rowIndex + "," + colIndex)
  if (rowIndex < 0 || colIndex < 0 || rowIndex > data.length - 1 || colIndex > data.length - 1) {
    //console.log("out of bounds")
    return 0;
  }
  if (data[rowIndex][colIndex] == true) {
    //console.log("alive")
    return 1
  }
  //console.log("dead")
  return 0;
}

function createSquareMatrix(size: number, randomized: boolean) {
  var result: boolean[][] = [];
  for (var i = 0; i < size; i++) {
    result[i] = [];
    for (var j = 0; j < size; j++) {
      if (randomized) {
        result[i][j] = Boolean(Math.floor(Math.random() * 2));
      } else {
        result[i][j] = false;
      }
    }
  }
  return result;
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
