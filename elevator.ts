const elevator = {
  init: function (elevators: Elevator[], floors: Floor[]) {
    console.log(floors[1]);
    function amin(numArray) {
      return Math.min.apply(null, numArray);
    }
    function amax(numArray) {
      return Math.max.apply(null, numArray);
    }

    function getRandomInt(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    var maxFloor = floors.length - 1;
    elevators.forEach(function (elevator, n) {
      elevator.goingUpIndicator(true);
      elevator.goingDownIndicator(false);
      elevator.one("floor_button_pressed", function (floorNum) {
        elevator.goToFloor(floorNum);
      });

      elevator.on("idle", function () {});
      elevator.on(
        "passing_floor",
        function (floorNum: number, direction: string) {
          if (elevator.getPressedFloors().indexOf(floorNum) > -1) {
            elevator.goToFloor(floorNum, true);
          } else if (
            elevator.loadFactor() < 0.7 &&
            floors[floorNum].buttonStates[direction] === "activated"
          ) {
            elevator.goToFloor(floorNum, true);
          }
        }
      );
      elevator.on("stopped_at_floor", function (floorNum: number) {
        if (elevator.currentFloor() == 0) {
          elevator.goingUpIndicator(true);
          elevator.goingDownIndicator(false);
          elevator.goToFloor(maxFloor);
        } else if (elevator.currentFloor() == maxFloor) {
          elevator.goingUpIndicator(false);
          elevator.goingDownIndicator(true);
          elevator.goToFloor(0);
        }
      });
    });
    floors.forEach(function (floor, n) {
      floor.on("up_button_pressed", function () {});
      floor.on("down_button_pressed", function () {});
    });
  },
  update: function (dt: number, elevators: Elevator[], floors: Floor[]) {},
};

interface Elevator {
  // Queue elevator to picked floor number.
  goToFloor: (floor: number, directly?: boolean) => void;
  // Clear the floor/destination queue and stop the elevator if it is moving.
  stop: () => void;
  // Gets the floor number that the elevator is currently on.
  currentFloor: () => number;
  // Sets the going up indicator / affects passenger behaviour when stopping by floors.
  goingUpIndicator: (set?: boolean) => void;
  // Sets the going down indicator.
  goingDownIndicator: (set?: boolean) => void;
  maxPassengerCount: () => number;
  loadFactor: () => number;
  // Gets the direction the elevator is currently going to move toward. Either up, down or stopped.
  destinationDirection: () => string;
  destinationQueue: number[];
  checkDestinationQueue: () => void;
  getPressedFloors: () => number[];
  on: (events: string, callback: Function) => void;
  one: (events: string, callback: Function) => void;
}

interface Floor {
  // Gets the floor number of the floor object.
  floorNum: () => number;
  // Listen for events (elevator button indicators)
  on: (events: string, Function) => void;
  // State of buttons if activated or null
  buttonStates: { down: string; up: string };
}
