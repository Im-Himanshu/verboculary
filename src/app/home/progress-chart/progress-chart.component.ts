import { Component, OnInit, ViewChild, AfterViewInit, Input, ElementRef } from '@angular/core';
import { Color, Label, BaseChartDirective, } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { SharingServiceService } from '../services/sharing-service.service'
import { Html2canvasService } from '../services/html2canvas.service'

@Component({
  selector: 'app-progress-chart',
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss'],
})

// note pan should always be subpart of the max-min of the range otherwise it behaves weirdly
export class ProgressChartComponent implements AfterViewInit {

  /*
  feed it the array of
  {
  "date" : {"viewed" : total # till Date, "learned" : total #till Date}
  "date" : {"viewed" : total # till Date, "learned" : total #till Date}
  }
  */
  @Input("chartLabelsAndData") chartLabelsAndData: any; // date to agregated progress data
  @ViewChild("container4", { static: false, read: ElementRef }) container4: ElementRef;
  isProcessed: boolean = false;
  chartOptions; 2
  chartLabels: Date[]
  img;
  noDataParsed: boolean = false;

  fillPattern: any;


  timeFormat = "MM/DD/YYYY HH:mm";

  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;
  chartData: ChartDataSets[] = [

  ];
  public lineChartColors;
  constructor(private shareService: SharingServiceService, private html2canvas: Html2canvasService) { }

  shareScreen() {
    const element = document.getElementById('html2canvas');
    const targetElement = document.getElementById('target').cloneNode(true);
    element.appendChild(targetElement);
    this.html2canvas.html2canvas(element.firstChild).then((img) => {
      this.img = img;
      console.log(this.img);
      element.firstChild.remove();
    }).catch((res) => {
      console.log(res);
    });
  }

  // this.shareService.shareImageViaScreenshot(this.container4);


  ngAfterViewInit(): void {
    let allDates = Object.keys(this.chartLabelsAndData);

    if (allDates.length == 0) {
      console.error("No Data was parsed for the charting graph")
      this.noDataParsed = true;
      return;
    }
    allDates.sort();
    let viewedSeries = [];
    let learnedSeries = [];
    this.chartLabels = [];
    this.chartData = [];
    let i = 0;
    for (let oneDate of allDates) {
      viewedSeries.push(this.chartLabelsAndData[oneDate]["viewed"])
      learnedSeries.push(this.chartLabelsAndData[oneDate]["learned"])
      this.chartLabels.push(new Date(oneDate)); // will convert the given date strign  to the date array
      i++;
    }


    let forViewed = {
      data: viewedSeries, label: "Viewed"
    }
    let forLearned = {
      data: learnedSeries, label: "Learned"
    }
    this.chartData.push(forViewed);
    this.chartData.push(forLearned)
    let lastDate = this.chartLabels[this.chartLabels.length - 1];
    let firstDate = this.chartLabels[0]
    // this.chartLabels = [this.newDate(-6), this.newDate(0), this.newDate(-1), this.newDate(-5), this.newDate(-2), this.newDate(-3), this.newDate(-4), this.newDate(-5)];
    let doc = document.getElementById("main");
    let height = doc.clientHeight;
    var canvas = <HTMLCanvasElement>document.getElementById('canvas')
    var ctx = canvas.getContext("2d");
    this.fillPattern = ctx.createLinearGradient(0, 0, 0, 100); //https://www.chartjq.org/docs/latest/general/colors.html

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
    let range_max: any = lastDate
    range_max.setDate(lastDate.getDate() + 1);
    let range_max2 = range_max.getTime()  // range of pan have to be greater then the range of min-max if it is less it doesn't work well..some logic get fucked up
    range_max.setDate(lastDate.getDate());
    range_max = range_max.getTime();

    let range_min: any = firstDate
    range_min.setDate(firstDate.getDate() - 2);
    let range_min2 = range_min.getTime();
    range_min.setDate(firstDate.getDate());
    range_min = range_min.getTime();


    // this.lineChartColors = [property, property2]; // both graph are of same design
    // let range_max: any = new Date();
    // range_max.setDate(new Date().getDate() + 1);
    // let range_max2 = range_max.getTime()  // range of pan have to be greater then the range of min-max if it is less it doesn't work well..some logic get fucked up
    // range_max.setDate(new Date().getDate());
    // range_max = range_max.getTime();

    // let range_min: any = new Date();
    // range_min.setDate(new Date().getDate() - 8);
    // let range_min2 = range_min.getTime();
    // range_min.setDate(new Date().getDate() - 7);
    // range_min = range_min.getTime();
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




  dragOptions = {
    animationDuration: 1000
  };


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