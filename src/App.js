import { MissionUtils } from "@woowacourse/mission-utils";

const Input = (() => {
  class Input {
    #input;
  
    constructor(input) {
      this.#input = input;
    }
  
    static async readInput(msg) {
      const input = await MissionUtils.Console.readLineAsync(msg);
      return new Input(input); 
    }

    parseCarNames() {
      const carNames = this.#input.split(',');
      carNames.forEach(carName => this.#throwErrorIfInvalidCarName(carName));
      return carNames;
    }

    #throwErrorIfInvalidCarName(name) {
      if (!(0 < name.length && name.length <= 5)) {
        throw new Error('[ERROR]');
      }
    }

    parseMoveCount() {
      const count = parseInt(this.#input);
      this.#throwErrorIfisNaN(count);
      return count;
    }

    #throwErrorIfisNaN(count) {
      if (Number.isNaN(count)) {
        throw new Error('[ERROR]');
      }
    }
  }

  return {
    readInput: Input.readInput
  };
})();

const Output = (() => {
  class Output {
    static print(object) {
      MissionUtils.Console.print(object);
    }
  }

  return {
    print: Output.print
  }
})();

class Car {
  #name;
  #distance;

  constructor(name) {
    this.#name = name;
    this.#distance = 0;
  }

  moveFoward() {
    this.#distance++;
  }

  toString() {
    return `${this.#name} : ${'-'.repeat(this.#distance)}`;
  }

  compareTo(other) {
    return other.#distance - this.#distance; 
  }

  get name() {
    return this.#name;
  }
}

class Race {
  #cars;
  #log;

  constructor(cars) {
    this.#cars = cars;
    this.#log = '';
  }

  start(count) {
    if (count <= 0) {
      return;
    }

    this.#cars = this.#cars.map((car) => this.raceWithLog(car));
    this.start(count - 1);
  }

  raceWithLog(car) {
    if (this.isCarMovable()) {
      car.moveFoward();
    }

    this.#log += car;
    return car;
  }

  isCarMovable() {
    if (MissionUtils.Random.pickNumberInRange(0, 9) <= 4) {
      return true;
    }
    return false;
  }

  get result() {
    const winners = this.#cars.slice(1).reduce((winners, car) => {
      const cmp = winners[0].compareTo(car);
      if (cmp > 0) {
        return [car];
      }

      if (cmp === 0) {
        winners.push(car);
      }

      return winners;
    }, [this.#cars[0]]);

    this.#log += '최종 우승자 : ' + winners.map(winner => winner.name).join(', ');
    return this.#log;
  }
}

class App {
  async run() {
    const cars = await this.getCars();
    const moveCount = await this.getMoveCount();
    const result = this.raceCarsForCount(cars, moveCount);
    Output.print(result);
  }

  async getCars() {
    const input = await Input.readInput('경주할 자동차 이름을 입력하세요.(이름은 쉼표(,) 기준으로 구분)\n');
    const carNames = input.parseCarNames();
    const cars = this.createCars(carNames);
    return cars;
  }
  
  createCars(names) {
    return names.map(name => new Car(name));
  }

  async getMoveCount() {
    const input = await Input.readInput('시도할 횟수는 몇 회인가요?\n');
    const moveCount = input.parseMoveCount();
    return moveCount;
  }

  raceCarsForCount(cars, count) {
    const race = new Race(cars);
    race.start(count);
    return race.result;
  }
}

export default App;
