const elements = {
  buttonStart: document.getElementById("b_start"),
  buttonPause: document.getElementById("b_pause"),
  buttonStop: document.getElementById("b_stop"),
  buttonReStart: document.getElementById("b_restart"),
  inputHours: <HTMLInputElement>document.getElementById("i_hours"),
  inputMinutes: <HTMLInputElement>document.getElementById("i_minutes"),
  inputSeconds: <HTMLInputElement>document.getElementById("i_seconds"),
  groupNotStart: document.querySelectorAll(".btn:not(#b_start)"),
  divTimeFields: document.getElementById("time_fields"),
  divProgress: document.getElementById("progress"),
  textTime: document.getElementById("t_time")
};

export default elements;
