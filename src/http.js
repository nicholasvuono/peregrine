import chalk from "chalk";
import request from "request";
import { performance } from "perf_hooks";

class http {

  constructor() {
    this._results = [];
  }

  options(options) {
    this._options = options;
  }

  requests(requests) {
    this._requests = requests;
  }

  async responses() {
    let responses = [];
    for (let i = 0; i < this._results.length; i++) {
      const resp = await Promise.all(this._results[i]);
      responses.push(resp)
    }
    this._responses = responses;
  }

  async concurrent() {
    let results = [];
    for (var i = 0; i < this._requests.length; i++) {
      const result = new Promise((resolve, reject) => {
        request(
          {
            url: this._requests[i].url,
            method: this._requests[i].method,
            headers: this._requests[i].headers,
            body: this._requests[i].body,
            json: true,
            time: true,
          },
          (err, res) => {
            if (err) return reject(err);
            return resolve(res);
          }
        );
      });
      results.push(result);
    }
    this._results.push(results);
  }

  async parallel() {
    for (var i = 0; i < this._options.vus; i++) {
      this.concurrent();
    }
  }

  async send() {
    process.stdout.write("\nRUNNING:");
    let end = performance.now() + this._options.duration * 1000;
    while (performance.now() < end) {
      for (var i = 0; i < this._options.ips; i++) {
        this.parallel();
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      process.stdout.write("|");
    }
    process.stdout.write(chalk.greenBright("...COMPLETE!"));
    await this.report();
  }

  async averageResonseTime() {
    let sum = 0;
    for (var k = 0; k < this._response_times.length; k++) {
      sum = sum + this._response_times[k];
    }
    let average = sum / this._response_times.length;
    this._average_response_time = average;
  }

  async ninetiethPercentileAndOtherMetrics() {
    let index = Math.round(this._response_times.length * 0.9);
    let indexTwo = Math.round(this._response_times.length * 0.95);
    let array = this._response_times;
    array.sort((a, b) => {
      return a - b;
    });
    this._nintieth_percentile_response_time = array[index - 1];
    this._ninety_fifth_percentile_response_time = array[indexTwo - 1];
    this._minimum_response_time = array[0];
    this._maximum_response_time = array[array.length - 1];
    let half = Math.floor(array.length / 2);
    if (array.length % 2) {
      this._median_response_time = array[half];
    } else {
      this._median_response_time = (array[half - 1] + array[half]) / 2.0;
    }
  }

  async report() {
    await this.responses();
    let responseTimes = [];
    for (var i = 0; i < this._responses.length; i++) {
      for (var j = 0; j < this._responses[i].length; j++) {
        responseTimes.push(this._responses[i][j].elapsedTime);
      }
    }
    this._response_times = responseTimes;
    await this.averageResonseTime();
    await this.ninetiethPercentileAndOtherMetrics();
    console.log(chalk.cyanBright(`\n\nvus................: ${this._options.vus}`));
    console.log(chalk.cyanBright(`duration...........: ${this._options.duration}s`));
    console.log(
      chalk.cyanBright(
        `iterations.........: ${this._options.ips * this._options.duration}`
      )
    );
    console.log(chalk.cyanBright(`ips................: ${this._options.ips}/s`));
    console.log(
      chalk.cyanBright(
        `http_rps...........: ${
          this._options.ips *
          this._options.vus *
          this._requests.length
        }/s`
      )
    );
    console.log(
      chalk.cyanBright(
        `request_count......: ${
          this._options.ips *
          this._options.duration *
          this._options.vus *
          this._requests.length
        }`
      )
    );
    console.log(
      chalk.cyanBright(
        `response_times.....: avg=${this._average_response_time}ms min=${this._minimum_response_time}ms med=${this._median_response_time}ms max=${this._maximum_response_time}ms    p(90)=${this._nintieth_percentile_response_time}ms p(95)=${this._ninety_fifth_percentile_response_time}ms\n\n`
      )
    );
  }

}

export default new http();