import { MissionUtils } from "@woowacourse/mission-utils";

class App {
  async run() {
    const cars = await this.inputCars();
    const moveCount = await this.inputMoveCount();
    const winners = this.raceCarsForCount(cars, moveCount);
    this.outputWinners(winners);
  }

  async inputCars() {
    const rawInput = await MissionUtils.Console.readLineAsync('경주할 자동차 이름을 입력하세요.(이름은 쉼표(,) 기준으로 구분)\n');
    const carNames = this.parseCarNames(rawInput);
    const cars = this.createCarsWithNames(carNames);
    return cars;
  } 

  parseCarNames(input) {
    const carNames = input.split(',');
    carNames.forEach(carName => this.throwErrorIfInvalidCarName(carName));
    return carNames;
  }

  throwErrorIfInvalidCarName(name) {
    if (!(0 < name.length && name.length <= 5)) {
      throw new Error('[ERROR]');
    }
  }
  
  createCarsWithNames(names) {
    return names.map(name => ({name, distance: 0}));
  }

  async inputMoveCount() {
    const rawInput = await MissionUtils.Console.readLineAsync('시도할 횟수는 몇 회인가요?\n');
    const moveCount = this.parseMoveCount(rawInput);
    return moveCount;
  }

  parseMoveCount(input) {
    const count = parseInt(input);
    this.throwErrorIfisNaN(count);
    return count;
  }

  throwErrorIfisNaN(count) {
    if (Number.isNaN(count)) {
      throw new Error('[ERROR]');
    }
  }

  raceCarsForCount(cars, count) {
    const carsAfterRaces = Array(count).fill(0).reduce((prev) => {
      const carsAfterRace = this.raceCars(prev);
      this.outputCars(carsAfterRace);
      return carsAfterRace;
    }, cars);

    const winners = this.winnersForCars(carsAfterRaces);
    return winners;
  }

  raceCars(cars) {
    const carsAfterRace = cars.map((car) => this.raceCar(car));
    return carsAfterRace;
  }

  outputCars(cars) {
    cars.forEach(car => {
      MissionUtils.Console.print(`${car.name} : ${'-'.repeat(car.distance)}`)
    });
  }

  raceCar(car) {
    if (this.isCarMovable()) {
      const movedCar = this.moveFoward(car);
      return movedCar;
    }
  
    return car;
  }

  isCarMovable() {
    if (MissionUtils.Random.pickNumberInRange(0, 9) <= 4) {
      return true;
    }
    return false;
  }

  moveFoward(car) {
    return {...car, distance: car.distance + 1};
  }

  winnersForCars(cars) {
    const { winners } = cars.reduce((acc, cur) => {
      if (cur.distance >= acc.maxDistance) {
        acc.winners.push(cur.name);
        acc.maxDistance = cur.distance;
        return acc;
      } 

      return {
        winners: [cur.name], 
        maxDistance: cur.distance
      };
    }, {winners: [], maxDistance: 0}); 

    return winners;
  }

  outputWinners(winners) {
    const result = '최종 우승자 : ' + winners.join(', ');
    MissionUtils.Console.print(result);
  }
}

export default App;
