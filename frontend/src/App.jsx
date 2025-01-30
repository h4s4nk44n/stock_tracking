import Header from './components/Header';
import ChartArea from './components/Chartarea';
import DataBoxes from './components/DataBoxes';
import { useState } from 'react';

const data = [
{'date': '2025-01-01', 'price': 129},
{'date': '2025-01-02', 'price': 122},
{'date': '2025-01-03', 'price': 109},
{'date': '2025-01-04', 'price': 118},
{'date': '2025-01-05', 'price': 114},
{'date': '2025-01-06', 'price': 118},
{'date': '2025-01-07', 'price': 163},
{'date': '2025-01-08', 'price': 153},
{'date': '2025-01-09', 'price': 146},
{'date': '2025-01-10', 'price': 130},
{'date': '2025-01-11', 'price': 162},
{'date': '2025-01-12', 'price': 221},
{'date': '2025-01-13', 'price': 234},
{'date': '2025-01-14', 'price': 246},
{'date': '2025-01-15', 'price': 239},
{'date': '2025-01-16', 'price': 245},
{'date': '2025-01-17', 'price': 269},
{'date': '2025-01-18', 'price': 257},
{'date': '2025-01-19', 'price': 213},
{'date': '2025-01-20', 'price': 234},
{'date': '2025-01-21', 'price': 187},
{'date': '2025-01-22', 'price': 218},
{'date': '2025-01-23', 'price': 226},
{'date': '2025-01-24', 'price': 232},
{'date': '2025-01-25', 'price': 197},
{'date': '2025-01-26', 'price': 212},
{'date': '2025-01-27', 'price': 238},
{'date': '2025-01-28', 'price': 199},
{'date': '2025-01-29', 'price': 150},
{'date': '2025-01-30', 'price': 168},
{'date': '2025-01-31', 'price': 203},
{'date': '2025-02-01', 'price': 220},
{'date': '2025-02-02', 'price': 215},
{'date': '2025-02-03', 'price': 183},
{'date': '2025-02-04', 'price': 164},
{'date': '2025-02-05', 'price': 182},
{'date': '2025-02-06', 'price': 154},
{'date': '2025-02-07', 'price': 177},
{'date': '2025-02-08', 'price': 124},
{'date': '2025-02-09', 'price': 117},
{'date': '2025-02-10', 'price': 150},
{'date': '2025-02-11', 'price': 136},
{'date': '2025-02-12', 'price': 186},
{'date': '2025-02-13', 'price': 163},
{'date': '2025-02-14', 'price': 171},
{'date': '2025-02-15', 'price': 115},
{'date': '2025-02-16', 'price': 74},
{'date': '2025-02-17', 'price': 60},
{'date': '2025-02-18', 'price': 116},
{'date': '2025-02-19', 'price': 137},
{'date': '2025-02-20', 'price': 92},
{'date': '2025-02-21', 'price': 130},
{'date': '2025-02-22', 'price': 115},
{'date': '2025-02-23', 'price': 156},
{'date': '2025-02-24', 'price': 205},
{'date': '2025-02-25', 'price': 213},
{'date': '2025-02-26', 'price': 226},
{'date': '2025-02-27', 'price': 198},
{'date': '2025-02-28', 'price': 181},
{'date': '2025-03-01', 'price': 143},
{'date': '2025-03-02', 'price': 181},
{'date': '2025-03-03', 'price': 198},
{'date': '2025-03-04', 'price': 255},
{'date': '2025-03-05', 'price': 208},
{'date': '2025-03-06', 'price': 159},
{'date': '2025-03-07', 'price': 150},
{'date': '2025-03-08', 'price': 185},
{'date': '2025-03-09', 'price': 241},
{'date': '2025-03-10', 'price': 235},
{'date': '2025-03-11', 'price': 282},
{'date': '2025-03-12', 'price': 234},
{'date': '2025-03-13', 'price': 273},
{'date': '2025-03-14', 'price': 246},
{'date': '2025-03-15', 'price': 234},
{'date': '2025-03-16', 'price': 241},
{'date': '2025-03-17', 'price': 254},
{'date': '2025-03-18', 'price': 288},
{'date': '2025-03-19', 'price': 263},
{'date': '2025-03-20', 'price': 282},
{'date': '2025-03-21', 'price': 251},
{'date': '2025-03-22', 'price': 229},
{'date': '2025-03-23', 'price': 222},
{'date': '2025-03-24', 'price': 274},
{'date': '2025-03-25', 'price': 306},
{'date': '2025-03-26', 'price': 338},
{'date': '2025-03-27', 'price': 355},
{'date': '2025-03-28', 'price': 401},
{'date': '2025-03-29', 'price': 373},
{'date': '2025-03-30', 'price': 403},
{'date': '2025-03-31', 'price': 398},
{'date': '2025-04-01', 'price': 349},
{'date': '2025-04-02', 'price': 399},
{'date': '2025-04-03', 'price': 417},
{'date': '2025-04-04', 'price': 451},
{'date': '2025-04-05', 'price': 451},
{'date': '2025-04-06', 'price': 474},
{'date': '2025-04-07', 'price': 486},
{'date': '2025-04-08', 'price': 481},
{'date': '2025-04-09', 'price': 430},
{'date': '2025-04-10', 'price': 380},
{'date': '2025-04-11', 'price': 434},
{'date': '2025-04-12', 'price': 442},
{'date': '2025-04-13', 'price': 410},
{'date': '2025-04-14', 'price': 436},
{'date': '2025-04-15', 'price': 457},
{'date': '2025-04-16', 'price': 434},
{'date': '2025-04-17', 'price': 487},
{'date': '2025-04-18', 'price': 474},
{'date': '2025-04-19', 'price': 436},
{'date': '2025-04-20', 'price': 427},
{'date': '2025-04-21', 'price': 435},
{'date': '2025-04-22', 'price': 374},
{'date': '2025-04-23', 'price': 349},
{'date': '2025-04-24', 'price': 315},
{'date': '2025-04-25', 'price': 350},
{'date': '2025-04-26', 'price': 344},
{'date': '2025-04-27', 'price': 385},
{'date': '2025-04-28', 'price': 406},
{'date': '2025-04-29', 'price': 443},
{'date': '2025-04-30', 'price': 470},
{'date': '2025-05-01', 'price': 483},
{'date': '2025-05-02', 'price': 515},
{'date': '2025-05-03', 'price': 479},
{'date': '2025-05-04', 'price': 460},
{'date': '2025-05-05', 'price': 421},
{'date': '2025-05-06', 'price': 435},
{'date': '2025-05-07', 'price': 458},
{'date': '2025-05-08', 'price': 459},
{'date': '2025-05-09', 'price': 449},
{'date': '2025-05-10', 'price': 402},
{'date': '2025-05-11', 'price': 359},
{'date': '2025-05-12', 'price': 359},
{'date': '2025-05-13', 'price': 347},
{'date': '2025-05-14', 'price': 321},
{'date': '2025-05-15', 'price': 293},
{'date': '2025-05-16', 'price': 280},
{'date': '2025-05-17', 'price': 321},
{'date': '2025-05-18', 'price': 286},
{'date': '2025-05-19', 'price': 281},
{'date': '2025-05-20', 'price': 299},
{'date': '2025-05-21', 'price': 338},
{'date': '2025-05-22', 'price': 332},
{'date': '2025-05-23', 'price': 310},
{'date': '2025-05-24', 'price': 339},
{'date': '2025-05-25', 'price': 286},
{'date': '2025-05-26', 'price': 280},
{'date': '2025-05-27', 'price': 298},
{'date': '2025-05-28', 'price': 272},
{'date': '2025-05-29', 'price': 285},
{'date': '2025-05-30', 'price': 318},
{'date': '2025-05-31', 'price': 283},
{'date': '2025-06-01', 'price': 292},
{'date': '2025-06-02', 'price': 340},
{'date': '2025-06-03', 'price': 376},
{'date': '2025-06-04', 'price': 343},
{'date': '2025-06-05', 'price': 317},
{'date': '2025-06-06', 'price': 337},
{'date': '2025-06-07', 'price': 360},
{'date': '2025-06-08', 'price': 382},
{'date': '2025-06-09', 'price': 386},
{'date': '2025-06-10', 'price': 366},
{'date': '2025-06-11', 'price': 392},
{'date': '2025-06-12', 'price': 420},
{'date': '2025-06-13', 'price': 452},
{'date': '2025-06-14', 'price': 483},
{'date': '2025-06-15', 'price': 485},
{'date': '2025-06-16', 'price': 465},
{'date': '2025-06-17', 'price': 445},
{'date': '2025-06-18', 'price': 483},
{'date': '2025-06-19', 'price': 457},
{'date': '2025-06-20', 'price': 464},
{'date': '2025-06-21', 'price': 445},
{'date': '2025-06-22', 'price': 406},
{'date': '2025-06-23', 'price': 424},
{'date': '2025-06-24', 'price': 436},
{'date': '2025-06-25', 'price': 444},
{'date': '2025-06-26', 'price': 395},
{'date': '2025-06-27', 'price': 447},
{'date': '2025-06-28', 'price': 458},
{'date': '2025-06-29', 'price': 438},
{'date': '2025-06-30', 'price': 416},
{'date': '2025-07-01', 'price': 409},
{'date': '2025-07-02', 'price': 425},
{'date': '2025-07-03', 'price': 407},
{'date': '2025-07-04', 'price': 392},
{'date': '2025-07-05', 'price': 430},
{'date': '2025-07-06', 'price': 423},
{'date': '2025-07-07', 'price': 385},
{'date': '2025-07-08', 'price': 361},
{'date': '2025-07-09', 'price': 343},
{'date': '2025-07-10', 'price': 362},
{'date': '2025-07-11', 'price': 332},
{'date': '2025-07-12', 'price': 358},
{'date': '2025-07-13', 'price': 382},
{'date': '2025-07-14', 'price': 370},
{'date': '2025-07-15', 'price': 314},
{'date': '2025-07-16', 'price': 281},
{'date': '2025-07-17', 'price': 279},
{'date': '2025-07-18', 'price': 306},
{'date': '2025-07-19', 'price': 336}

];

function App() {
  const [selectedDate, setSelectedDate] = useState(null); // State to store the selected date

  return (
    <div className="app">
      <Header />
      <ChartArea data={data} onDateSelect={setSelectedDate} /> {/* Pass the callback */}
      <DataBoxes date={selectedDate} /> {/* Pass the selected date */}
    </div>
  );
}

export default App;
