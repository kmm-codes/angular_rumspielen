import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { isFormArray } from '@angular/forms';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { ActualcanvasComponent } from '../actualcanvas/actualcanvas.component';
import { GolsettingsComponent } from '../golsettings/golsettings.component';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('myCanvas')
  private canvas: ElementRef = {} as ElementRef;
  private context!: CanvasRenderingContext2D;
  actualcanvas!: ElementRef;
  data: boolean[][];
  rectSize = 50;
  canvasDrawBorder = true;
  SettingCanvasRectsSpaceBetween = 1;
  canvasRectsSpaceBetween = 1;
  canvasRectsX = 1;
  canvasRectsY = 1;
  canvasHeight = 500;
  canvasWidth = 500;
  running = false;
  canvasHeightWithSpaces = 500;
  canvasWidthWithSpaces = 500;
  renderTypeTable = false;
  renderTypeCanvas = true;
  constructor() {
    this.data = createSquareMatrix(GolsettingsComponent.fieldSizeX, GolsettingsComponent.fieldSizeY, true);
  }
  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.drawGridOnCanvas();
  }
  get fieldSizeX() {
    return GolsettingsComponent.fieldSizeX;
  }
  set fieldSizeX(size: number) {
    GolsettingsComponent.fieldSizeX = size
  }
  get fieldSizeY() {
    return GolsettingsComponent.fieldSizeY;
  }
  set fieldSizeY(size: number) {
    GolsettingsComponent.fieldSizeY = size
  }
  get refreshIntervalMs() {
    return GolsettingsComponent.refreshIntervalMs
  }
  set refreshIntervalMs(interval: number) {
    GolsettingsComponent.refreshIntervalMs = interval
  }
  makePlayfield() {
    this.data = createSquareMatrix(GolsettingsComponent.fieldSizeX, GolsettingsComponent.fieldSizeY, true);
    this.running = false;
    this.drawGridOnCanvas();
  }
  makeEmptyField() {
    this.data = createSquareMatrix(GolsettingsComponent.fieldSizeX, GolsettingsComponent.fieldSizeY, false);
    this.running = false;
    this.drawGridOnCanvas();
  }
  async engine() {
    while (true) {
      if (this.running) {
        this.step();
      }
      await delay(GolsettingsComponent.refreshIntervalMs);
    }
  }

  drawBorderChanged() {
    if (this.canvasDrawBorder) {

    }
  }

  calculateCanvasDimensions() {
    this.canvasRectsX = this.data[0].length
    this.canvasRectsY = this.data.length
    //console.log(`canvasRectsX = ${this.canvasRectsX}`)
    //console.log(`canvasRectsY = ${this.canvasRectsY}`)
    this.rectSize = Math.round((this.canvasHeight / this.canvasRectsY))
    this.canvasHeightWithSpaces = this.canvasRectsY * (this.rectSize + this.canvasRectsSpaceBetween);
    this.canvasWidthWithSpaces = this.canvasRectsX * (this.rectSize + this.canvasRectsSpaceBetween);
    this.canvas.nativeElement.height = this.canvasHeightWithSpaces;
    this.canvas.nativeElement.width = this.canvasWidthWithSpaces;
  }
  drawGridOnCanvas() {
    var color_dead = "#A0A0A0"
    var color_alive = "#0094FF"
    var color_background = "#000000"
    this.calculateCanvasDimensions()
    this.context.lineWidth = 0.2;
    //fix blurryness
    //this.fixCanvas()

    //draw background
    if (this.canvasDrawBorder) {
      this.context.fillStyle = color_background;
      this.context.fillRect(0, 0, this.canvasHeightWithSpaces, this.canvasWidthWithSpaces);
      this.canvasRectsSpaceBetween = this.SettingCanvasRectsSpaceBetween;
    } else {
      this.canvasRectsSpaceBetween = 0;
    }

    this.calculateCanvasDimensions()

    for (var i = 0; i < this.canvasRectsY; i++) {
      for (var j = 0; j < this.canvasRectsX; j++) {
        this.context.beginPath();
        this.context.fillStyle = color_dead;
        if (this.data[i][j]) {
          this.context.fillStyle = color_alive;
        }
        this.context.fillRect(j * Math.round((this.rectSize + this.canvasRectsSpaceBetween)), i * Math.round((this.rectSize + this.canvasRectsSpaceBetween)), Math.round(this.rectSize), Math.round(this.rectSize));
        this.context.stroke();
      }
    }
  }

  step() {
    let killed = 0;
    let born = 0;
    let data = this.data;
    //var newData = this.data.map(function (arr) {
    //return arr.slice();
    //});
    var newData = [];

    for (var i = 0; i < this.data.length; i++)
      newData[i] = this.data[i].slice(); for (let rowIndex = 0; rowIndex < this.data.length; rowIndex++) {
        for (let colIndex = 0; colIndex < this.data[0].length; colIndex++) {
          //console.log(`colIndex:${colIndex}, rowIndex:${rowIndex}`)
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
          } else {
            //console.log(`Die Zelle ${rowIndex},${colIndex} ist ${cellIsAliveStr} und hat 0 lebende Nachbarn`)
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
        }
      };

    if (born === 0 && killed === 0) {
      this.running = false;
    }
    this.data = newData;
    this.drawGridOnCanvas();
  }

  toggleField(rowindex: number, colindex: number) {
    this.data[rowindex][colindex] = !this.data[rowindex][colindex]
    this.drawGridOnCanvas();
  }
  startClicked() {
    this.running = !this.running;
  }

  ngOnInit(): void {
    this.engine();
    //this.test();
  }

  test() {
    // Create circle
    const circle = new Path2D();
    circle.arc(150, 75, 50, 0, 2 * Math.PI);
    this.context.fillStyle = 'red';
    this.context.fill(circle);
    var ctx = this.context
    var canvas = this.canvas.nativeElement
    // Listen for mouse moves
    canvas.nativeElement.addEventListener('mousemove', function (event: any) {
      // Check whether point is inside circle
      if (ctx.isPointInPath(circle, event.offsetX, event.offsetY)) {
        ctx.fillStyle = 'green';
      }
      else {
        ctx.fillStyle = 'red';
      }

      // Draw circle
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fill(circle);
    });
  }
}
function isAlive(rowIndex: number, colIndex: number, data: boolean[][]): number {
  //console.log("check isAlive for " + rowIndex + "," + colIndex)
  if (rowIndex < 0 || colIndex < 0 || rowIndex > data.length - 1 || colIndex > data[0].length - 1) {
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

function createSquareMatrix(sizeX: number, sizeY: number, randomized: boolean) {
  var result: boolean[][] = [];
  for (var i = 0; i < sizeY; i++) {
    result[i] = [];
    for (var j = 0; j < sizeX; j++) {
      if (randomized) {
        var isAlive = Boolean(Math.floor(Math.random() * 2));
        if (isAlive) {
          //nochmal würfeln, damit nicht zu viele Zellen lebendig sind
          isAlive = Boolean(Math.floor(Math.random() * 2));
        }
        result[i][j] = isAlive;
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
