import { useEffect ,useState} from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Divider from "@mui/material/Divider";
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import moment from 'moment';
import 'moment/dist/locale/ar-dz';
moment.locale('ar')
export default function MainProject() {
const [today,setToday]=useState('')
// first way
// const updateClock= () => {
//   var now = new Date();
//   var hours = now.getHours();
//   var minutes = now.getMinutes();
//   var seconds = now.getSeconds();
//   var year = now.getFullYear();
// var month = now.getMonth(); // beware: January = 0; February = 1, etc.
// var day = now.getDate();
//   var time = `${seconds} : ${minutes} : ${hours}`;
//   var date = `${day} - ${month} - ${year}`;
// setDay(time)
// setDate(date)
// }
// useEffect(()=>{
//   // Update clock every second
  // setInterval(updateClock, 1000);
// },[days])
const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
  const [timings , setTimings] = useState({
    "Fajr": "04:40",
    "Dhuhr": "11:22",
    "Asr": "14:10",
    "Maghrib": "16:29",
    "Isha": "17:54",
  });
  const [remainingTime, setRemainingTime] = useState("");
  const [selectedCountry , setselectedCountry] = useState({
    displayName:"لبنان",
    apiName:"lebanon"
  })
  const availableCity = [{
    displayName:"لبنان",
    apiName:"lebanon"
  },
  {
    displayName:"اليمن",
    apiName:"yemen"
  },
  {
    displayName:"مصر",
    apiName:"Egypt"
  }]
  
	const prayersArray = [
		{ key: "Fajr", displayName: "الفجر" },
		{ key: "Dhuhr", displayName: "الظهر" },
		{ key: "Asr", displayName: "العصر" },
		{ key: "Sunset", displayName: "المغرب" },
		{ key: "Isha", displayName: "العشاء" },
	];

  const getTimings = async()=>{
    const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=${selectedCountry.apiName}&city=tripoli`)
    setTimings(response.data.data.timings)
  }
  useEffect(() => {
		getTimings();
	}, [selectedCountry]);
  useEffect(() => {
		let interval = setInterval(() => {
			setupCountdownTimer();
		}, 1000);

		const t = moment();
		setToday(t.format("MMM Do YYYY | h:mm"));
    //fix trouble of mount and unmount ,clean code works
		return () => {
			clearInterval(interval);
		};
	}, [timings]);
  ///set salat Name 
  const setupCountdownTimer = () => {
		const momentNow = moment();

		let prayerIndex = 2;

		if (
			momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
		) {
			prayerIndex = 1;
		} else if (
			momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
		) {
			prayerIndex = 2;
		} else if (
			momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))
		) {
			prayerIndex = 3;
		} else if (
			momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
		) {
			prayerIndex = 4;
		} else {
			prayerIndex = 0;
		}

		setNextPrayerIndex(prayerIndex);

		// now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time
		const nextPrayerObject = prayersArray[prayerIndex];
		const nextPrayerTime = timings[nextPrayerObject.key];
		const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

		let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

		if (remainingTime < 0) {
			const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
			const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
				moment("00:00:00", "hh:mm:ss")
			);

			const totalDiffernce = midnightDiff + fajrToMidnightDiff;

			remainingTime = totalDiffernce;
		}
		console.log(remainingTime);

		const durationRemainingTime = moment.duration(remainingTime);

		setRemainingTime(
			`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
		);
		console.log(
			"duration issss ",
			durationRemainingTime.hours(),
			durationRemainingTime.minutes(),
			durationRemainingTime.seconds()
		);
	};
  const handleCityChange = async (event) => {
    const cityObj = availableCity.find((city)=> {
      return city.apiName == event.target.value
    })
    setselectedCountry(cityObj);
    console.log(event.target.value)
  //   const response = await axios.get(`https://restcountries.com/v3.1/all`)
  //   const country = response.name.common
  // console.log(response)
  // response.map(c=>{
  //   setCountry({ 
  //     displayName: c.name.common,
  //     apiName:c.name.nativeName.ara
  //   })
  //     })
  };

  return (
    <>
      <Grid container style={{color:"white"}}>
      <Grid xs={6}>
        <div>
        <h3> {today} </h3>
        <h1>{selectedCountry.displayName}</h1>
        </div>
        </Grid>
        <Grid xs={6}>
          <div>
        <h3>متبقي حتى صلاة  {prayersArray[nextPrayerIndex].displayName} </h3>
        <h1>{remainingTime}</h1>
        </div>
        </Grid>
        </Grid>
        <Divider style={{ borderColor: "white", opacity: "0.1" }} />
        <Stack direction="row" justifyContent={"space-around"} style={{ marginTop: "50px" }}>
          <Prayer name="الفجر" time={timings.Fajr} image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcCbhekgqsjwv7PNZYNqH7L0S-467KdCwdqg&usqp=CAU"/>
          <Prayer name="الظهر" time={timings.Dhuhr}  image="https://cdn.alweb.com/thumbs/awkatalsalah/article/fit727x545/%D8%A7%D9%84%D9%81%D8%B1%D9%82-%D8%A8%D9%8A%D9%86-%D8%A7%D9%84%D9%81%D8%AC%D8%B1-%D9%88%D8%A7%D9%84%D8%B5%D8%A8%D8%AD-%D9%88%D8%A7%D9%84%D8%B6%D8%AD%D9%89.jpg"/>
          <Prayer name="العصر" time={timings.Asr}  image="https://mediaaws.almasryalyoum.com/news/medium/2023/07/06/2145700_0.jpg"/>
          <Prayer name="المغرب" time={timings.Maghrib}  image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3qa8PSIWenx_7fz6jU7pn4vhylEn4TcLOUAQN-o2EMzvLIzat_IM1okrV8tTwMhmabYM&usqp=CAU"/>
          <Prayer name="العشاء" time={timings.Isha}  image="https://www.alsolta.net/img/22/12/20/229922_M.jpg"/>
</Stack>
<Stack direction="row"
				justifyContent={"center"}
				style={{ marginTop: "40px" }}>
      <FormControl style={{ width: "20%" }}>
        <InputLabel id="demo-simple-select-label">
        <span style={{ color: "white" }}>المدينة</span>
        </InputLabel>
        <Select
          style={{ color: "white" }}
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					label="Age"
          onChange={handleCityChange}
        >
        {availableCity.map((city)=>{
          return(
          <MenuItem value={city.apiName} key={city.apiName}>{city.displayName}</MenuItem>
          )})
          }
        </Select>
      </FormControl>
    </Stack>
    </>
  )
}
