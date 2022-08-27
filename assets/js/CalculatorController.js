export default class CalculatorController {
  constructor() {
    this._audio = new Audio("assets/audios/click.mp3");
    this._audioOnOff = false;
    this._operation = [];
    this._lastOperator = "";
    this._penultOperador = "";
    this._lastNumber = "";
    this._locale =
      navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language;
    this._audioIcon = document.querySelector("#sound");
    this._displayResultEl = document.querySelector("#result");
    this._displayDateEl = document.querySelector("#date");
    this._displayTimeEl = document.querySelector("#time");
    this._currentDate;
    this.initialize();
    this.initiButtonsEvents();
    this.initKeyboard();
  }

  /**
   * Calculator start method
   */
  initialize() {
    this.setDisplayDateTime();
    setInterval(() => {
      this.setDisplayDateTime();
    }, 1000);
    this.setLastNumberToDisplay();
    this.pasteFromClipBoard();

    document.querySelector("#btn-sound").addEventListener("click", (e) => {
      this.toggleAudio();
    });
  }

  /**
   * Audio on/off method
   */
  toggleAudio() {
    this._audioOnOff = !this._audioOnOff;
    this.toogleAudioIcon();
  }

  /**
   * Audio icon display method
   */
  toogleAudioIcon() {
    this._audioOnOff
      ? (this._audioIcon.style.display = "block")
      : (this._audioIcon.style.display = "none");
  }

  /**
   * Play audio method
   */
  playAudio() {
    if (this._audioOnOff) {
      this._audio.currentTime = 0;
      this._audio.play();
    }
  }

  /**
   * Clipboard paste method
   */
  pasteFromClipBoard() {
    document.addEventListener("paste", (e) => {
      let text = e.clipboardData.getData("Text");
      this.displayResult = parseFloat(text).toString();
    });
  }

  /**
   * Calculator reset method
   */
  clearAll() {
    this._operation = [];
    this._lastOperator = "";
    this._penultOperador = "";
    this._lastNumber = "";
    this.setLastNumberToDisplay();
  }

  /**
   * Cancel entry method
   */
  cancelEntry() {
    this._operation.pop();
    this.displayResult = "0";
  }

  /**
   * Set error method
   * @param {*} string
   */
  setError(string = "ERROR") {
    this.displayResult = string;
  }

  /**
   * Get last element of array this._operation
   * @returns
   */
  getLastOperation() {
    return this._operation[this._operation.length - 1];
  }

  /**
   * Set last element of array this._operation
   * @param {*} value
   */
  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value;
  }

  /**
   * Get first element of array this._operation
   * @returns
   */
  getFirstItem() {
    return this._operation[0];
  }

  /**
   * Set first element of array this._operation
   * @param {*} value
   */
  setFirstItem(value) {
    this._operation[0] = value;
  }

  /**
   * Checks if the entered value is an operator
   * @param {*} value
   * @returns
   */
  isOperator(value) {
    return ["+", "-", "*", "/", "%", "^"].indexOf(value) > -1;
  }

  /**
   * Insert an operation into the thi._operation array
   * and call the calc() method if the array is greater than 3.
   * @param {*} value
   */
  pushOperation(value) {
    this._operation.push(value);
    if (this._operation.length > 3) {
      this.calc();
    }
  }

  /**
   * Method to get the result
   * @returns
   */
  getResult() {
    return eval(this._operation.join("")).toString();
  }

  /**
   * Method that performs the evaluation according
   * to the values ​​in the matrix and in the control variables.
   */
  calc() {
    let last;

    let firstItem = this.getFirstItem();
    this._lastOperator = this.getLastItem();

    if (this._operation.length == 1) {
      this._lastNumber = this._lastNumber != "" ? this._lastNumber : "0";
      this._lastOperator = this._lastOperator != "" ? this._lastOperator : "+";
      this._operation = [firstItem, this._lastOperator, this._lastNumber];
    }

    if (this._operation.length == 2) {
      if (this._lastOperator == "%") {
        this._lastNumber = "100";
        this._lastOperator = "/";
        this._operation = [firstItem, this._lastOperator, this._lastNumber];
      } else {
        this._lastNumber = firstItem;
        this._operation = [firstItem, this._lastOperator, this._lastNumber];
      }
    }

    if (this._operation.length > 3) {
      last = this._operation.pop();
      this._penultOperador = this._operation[1];
      this._lastNumber = this.getResult();
    } else if (this._operation.length === 3) {
      this._lastNumber = this.getLastItem(false);
      if (this._lastOperator == "^") {
        this._operation = [
          Math.pow(firstItem, this._lastNumber),
          (this._lastOperator = ""),
          (this._lastNumber = ""),
        ];
      } else {
        if (this._operation[1] == "/" && this._operation[2] == "0") {
          this._operation = [this._operation[2], "+", this._operation[2]];
        } else {
          this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }
      }
    }

    let result = this.getResult();

    if (result == "NaN") {
      result = "0";
    }

    if (last == "%") {
      let number = this.getLastItem(false);
      let ratio = eval([number, "/", "100"].join("")).toString();
      if (this._penultOperador == "+" || this._penultOperador == "-") {
        this._lastNumber = eval([firstItem, "*", ratio].join("")).toString();
        this._operation = [firstItem, this._penultOperador, this._lastNumber];
      } else {
        this._lastNumber = ratio;
        this._operation = [number, this._penultOperador, ratio];
      }
      result = this.getResult();
      this._operation = [result];
      this._lastOperator = this._penultOperador;
    } else {
      this._operation = [result];
      if (last) this._operation.push(last);
    }
    this.setLastNumberToDisplay();
  }

  /**
   * Method that gets the last item
   * by checking whether or not it is an operator
   * @param {*} isOperator
   * @returns
   */
  getLastItem(isOperator = true) {
    let lastItem;
    for (let i = this._operation.length - 1; i >= 0; i--) {
      if (this.isOperator(this._operation[i]) == isOperator) {
        lastItem = this._operation[i];
        break;
      }
    }
    if (!lastItem) {
      lastItem = isOperator ? this._lastOperator : this._lastNumber;
    }
    return lastItem;
  }

  /**
   * Method that shows the result in the display
   */
  setLastNumberToDisplay() {
    let lastNumber = this.getLastItem(false);
    if (!lastNumber) lastNumber = "0";
    this.displayResult = lastNumber;
  }

  /**
   * Method that checks the entered value and directs the operation
   * @param {*} value
   */
  addOperation(value) {
    if (isNaN(this.getLastOperation())) {
      if (this.isOperator(value)) {
        this.setLastOperation(value);
      } else {
        this.pushOperation(value);
        this.setLastNumberToDisplay();
      }
    } else {
      if (this.isOperator(value)) {
        this.pushOperation(value);
      } else {
        if (this.getFirstItem() == "0" && !isNaN(value)) {
          this.setFirstItem(value);
          this.setLastNumberToDisplay();
        } else {
          let newValue = this.getLastOperation().toString() + value.toString();
          this.setLastOperation(newValue);
          this.setLastNumberToDisplay();
        }
      }
    }
  }

  /**
   * Point insertion verification method
   * @returns
   */
  addDot() {
    let lastOperation = this.getLastOperation();
    if (
      typeof lastOperation === "string" &&
      lastOperation.split("").indexOf(".") > -1
    )
      return;
    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation("0.");
    } else {
      this.setLastOperation(lastOperation.toString() + ".");
    }
    this.setLastNumberToDisplay();
  }

  /**
   * Method that checks the clicked value
   * and directs to the appropriate method
   * @param {*} value
   */
  btnAction(value) {
    this.playAudio();

    switch (value) {
      case "ac":
        this.clearAll();
        break;
      case "ce":
        this.cancelEntry();
        break;
      case "percent":
        this.addOperation("%");
        break;
      case "times":
        this.addOperation("*");
        break;
      case "divide":
        this.addOperation("/");
        break;
      case "minus":
        this.addOperation("-");
        break;
      case "plus":
        this.addOperation("+");
        break;
      case "equals":
        this.calc();
        break;
      case "power":
        this.addOperation("^");
        break;
      case "dot":
        this.addDot();
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.addOperation(value);
        break;
      default:
        this.setError();
        break;
    }
  }

  /**
   * Method that checks the entered value
   * and directs to the appropriate method
   */
  initKeyboard() {
    document.addEventListener("keyup", (e) => {
      this.playAudio();

      switch (e.key) {
        case "Escape":
          this.clearAll();
          break;
        case "Backspace":
          this.cancelEntry();
          break;
        case "%":
        case "*":
        case "/":
        case "-":
        case "+":
          this.addOperation(e.key);
          break;
        case "Enter":
        case "=":
          this.calc();
          break;
        case "Dead":
          this.addOperation("^");
          break;
        case ".":
        case ",":
          this.addDot();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          this.addOperation(e.key);
          break;
      }
    });
  }

  /**
   * Listener method that takes
   * an element, events and function by parameter
   * @param {*} element
   * @param {*} events
   * @param {*} fn
   */
  addEventListenerAll(element, events, fn) {
    events.split(" ").forEach((event) => {
      element.addEventListener(event, fn, false);
    });
  }

  /**
   * Method that listens for the clicked button
   * and calls the addEventListenerAll() method
   * passing the btnAction() function and the value of the button
   */
  initiButtonsEvents() {
    let buttons = document.querySelectorAll("#buttons > div");

    buttons.forEach((btn, index) => {
      this.addEventListenerAll(btn, "click", (e) => {
        let btnText = btn.id.replace("btn-", "");
        this.btnAction(btnText);
      });
    });
  }

  /**
   * Date and time display method
   */
  setDisplayDateTime() {
    this.displayDate = this.currenteDate.toLocaleDateString(this._locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    this.displayTime = this.currenteDate.toLocaleTimeString(this._locale);
  }

  get displayDate() {
    return this._displayDateEl.innerHTML;
  }

  set displayDate(value) {
    return (this._displayDateEl.innerHTML = value);
  }

  get displayTime() {
    return this._displayTimeEl.innerHTML;
  }

  set displayTime(value) {
    this._displayTimeEl.innerHTML = value;
  }

  get displayResult() {
    return this._displayResultEl.innerHTML;
  }

  set displayResult(value) {
    let newValue;

    if (value.toString().indexOf(".") > -1) {
      if (value.toString().indexOf("e") > -1) {
        newValue = Number(value);
      } else {
        let newvalueArray = value.toString().split(".");
        let floatLength = newvalueArray[1].length;
        if (floatLength > 9) {
          newValue = Number(value).toFixed(9);
        } else {
          newValue = Number(value).toFixed(floatLength);
        }
      }
    } else {
      newValue = Number(value);
    }

    if (newValue.toString().length > 14) {
      newValue = Number(newValue).toExponential(4);
    }
    return (this._displayResultEl.innerHTML = newValue.toString());
  }

  get currenteDate() {
    return new Date();
  }

  set currenteDate(value) {
    this._currenteDate = value;
  }
}
