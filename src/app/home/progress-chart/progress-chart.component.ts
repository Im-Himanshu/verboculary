import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Color, Label, BaseChartDirective, } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
@Component({
  selector: 'app-progress-chart',
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss'],
})

// note pan should always be subpart of the max-min of the range otherwise it behaves weirdly
export class ProgressChartComponent implements AfterViewInit {

  isProcessed: boolean = false;
  chartOptions;
  chartLabels: Date[]

  ngAfterViewInit(): void {
    this.chartLabels = [this.newDate(0), this.newDate(-1), this.newDate(-2), this.newDate(-3), this.newDate(-4), this.newDate(-5), this.newDate(-6)];


    let doc = document.getElementById("main");
    let height = doc.clientHeight;
    var canvas = <HTMLCanvasElement>document.getElementById('canvas')
    var ctx = canvas.getContext("2d");
    this.fillPattern = ctx.createLinearGradient(0, 0, 0, 100); //https://www.chartjs.org/docs/latest/general/colors.html

    var gradientFill = ctx.createLinearGradient(0, 0, 0, 600); // start from top left side and goes to the bottom right
    var gradientStroke = ctx.createLinearGradient(400, 0, 100, 0);

    // gradientStroke.addColorStop(0, "#80b6f4");
    // gradientStroke.addColorStop(0.2, "#94d973");
    // gradientStroke.addColorStop(0.5, "#fad874");
    // gradientStroke.addColorStop(1, "#f49080");
    gradientStroke.addColorStop(0, '#80b6f4');
    gradientStroke.addColorStop(1, '#f49080'); //at 100 
    gradientFill.addColorStop(0, "rgba(254, 254, 254, 0.8)");
    gradientFill.addColorStop(1, "rgba(254, 254, 254, 0.5)");

    //https://blog.vanila.io/chart-js-tutorial-how-to-make-gradient-line-chart-af145e5c92f9

    let property = {
      backgroundColor: "#fefdfd63",
      borderWidth: 0,
      pointRadius: 0,
      pointBorderWidth: 0,
      //borderColor: "#ffffff",
      // pointBorderColor: gradientStroke,
      // pointBackgroundColor: gradientStroke,
      // pointHoverBackgroundColor: gradientStroke,
      // pointHoverBorderColor: gradientStroke

      //backgroundimage: 'linear-gradient(direction, color-stop1, color-stop2, ...)'
    }
    let property2 = {
      backgroundColor: gradientFill, // always be the lower one because it has higher opacity so first one blend well in background
      borderWidth: 0,
      pointRadius: 0,
      pointBorderWidth: 0,
      //borderColor: "#0c0b0cba",
      // pointBorderColor: gradientStroke,
      // pointBackgroundColor: gradientStroke,
      // pointHoverBackgroundColor: gradientStroke,
      // pointHoverBorderColor: gradientStroke

      //backgroundimage: 'linear-gradient(direction, color-stop1, color-stop2, ...)'
    }


    // the final logic will be :
    // 1. the min and max of range will decide the landing view of the user -6, +1 || -7, +0
    // 2. the range_min and range_mix will be decided based on the user data history
    // range_min = minimum date-2 days and range_max --> today+1 never below the actual limit 
    this.lineChartColors = [property, property2]; // both graph are of same design
    let range_max: any = new Date();
    range_max.setDate(new Date().getDate() + 1);
    let range_max2 = range_max.getTime()  // range of pan have to be greater then the range of min-max if it is less it doesn't work well..some logic get fucked up
    range_max.setDate(new Date().getDate());
    range_max = range_max.getTime();

    let range_min: any = new Date();
    range_min.setDate(new Date().getDate() - 7);
    let range_min2 = range_min.getTime();
    range_min.setDate(new Date().getDate() - 6);
    range_min = range_min.getTime();
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        easing: "easeInOutBack"
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              parser: this.timeFormat,
              // round: 'day'
              tooltipFormat: "ll HH:mm"
            },
            scaleLabel: {
              display: false,
              labelString: "Date"
            },
            ticks: {
              padding: 0,
              fontColor: "#ffffff78",
              min: range_min,
              max: range_max
              // fontStyle: "bold"
            },
            gridLines: {
            },
          }
        ],
        yAxes: [{
          ticks: {
            beginAtZero: false
          },
          gridLines: {
            drawTicks: false,
            display: false
          }
        }]
      },
      plugins: {
        zoom: {
          // Container for pan options
          pan: {
            // Boolean to enable panning
            enabled: true,
            sensitivity: 0.3,

            // Panning directions. Remove the appropriate direction to disable 
            // Eg. 'y' would only allow panning in the y direction
            mode: 'x',
            rangeMin: {
              x: range_min2,
            },
            rangeMax: {
              x: range_max2,
            },
          },

          // Container for zoom options
          zoom: {
            // Boolean to enable zooming
            enabled: true,

            // Zooming directions. Remove the appropriate direction to disable 
            // Eg. 'y' would only allow zooming in the y direction
            mode: 'x',
            rangeMin: {
              x: range_min2
            },
            rangeMax: {
              x: range_max2
            },
          }
        }
      }
    };


    this.isProcessed = true;

  }


  fillPattern: any;
  constructor() {


  }

  timeFormat = "MM/DD/YYYY HH:mm";

  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;
  chartData: ChartDataSets[] = [
    { data: [450, 400, 350, 300, 100, 80, 15,], label: 'Series A' },
    { data: [400, 350, 300, 250, 150, 70, 10], label: 'Series B' }
  ];

  dragOptions = {
    animationDuration: 1000
  };
  public lineChartColors;


  onChartClick(event) {
    console.log(event);
  }

  newDate(days): Date {
    let date = new Date();
    date.setDate(date.getDate() + days)
    return date;

  }
  resetZoom() {

    this.chart.chart.ctx.createLinearGradient(0, 0, 0, 400)
    this.chart.chart['resetZoom']();
    //window.myLine.resetZoom();
  }




}



//https://codepen.io/jledentu/pen/NWWZryv
// https://codepen.io/marcusvilete/details/EEpKMx -- ver good example