import { Component, OnInit } from '@angular/core';
import { isFormArray } from '@angular/forms';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  data: number[][];
  fieldSize = 10;
  running = false;
  constructor() {
    this.data = createSquareMatrix(10);
  }

  makePlayfield() {
    this.data = createSquareMatrix(this.fieldSize);
    this.running = false;
  }

  async engine() {
    while (true) {
      if (this.running) {
        this.step();
      }
      await delay(200);
    }
  }

  step() {
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
        let cellIsAliveStr = "tot"
        if (cellIsAlive > 0) {
          cellIsAliveStr = "lebending"
        }
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
        if (numNeighbors < 2) {
          newData[rowIndex][colIndex] = 0;
        }
        //A living cell surrounded by more than 3 living cells will also die.
        if (numNeighbors > 3) {
          newData[rowIndex][colIndex] = 0;
        }
        //A dead cell surrounded by 3 living cells will be reborn.
        if (!cellIsAlive && numNeighbors === 3) {
          console.log(`Erwecke Zelle ${rowIndex},${colIndex} zum leben`)
          newData[rowIndex][colIndex] = 1;
        }

        colIndex++;
      })
      rowIndex++;
    });


    this.data = newData;
  }

  startClicked() {
    this.running = !this.running;
  }

  ngOnInit(): void {
    this.engine();
  }
}
function isAlive(rowIndex: number, colIndex: number, data: number[][]): number {
  //console.log("check isAlive for " + rowIndex + "," + colIndex)
  if (rowIndex < 0 || colIndex < 0 || rowIndex > data.length - 1 || colIndex > data.length - 1) {
    //console.log("out of bounds")
    return 0;
  }
  if (data[rowIndex][colIndex] == 1) {
    //console.log("alive")
    return 1
  }
  //console.log("dead")
  return 0;
}

function createSquareMatrix(size: number) {
  var result: number[][] = [];
  for (var i = 0; i < size; i++) {
    result[i] = [];
    for (var j = 0; j < size; j++) {
      result[i][j] = Math.floor(Math.random() * 2);
    }
  }
  return result;
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
