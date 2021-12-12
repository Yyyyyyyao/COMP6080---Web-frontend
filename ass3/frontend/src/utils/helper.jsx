// custom fetch function
// refer from ass2
export function myfetch (method, path, token, mybody) {
  const settings = {
    method: method,
    headers: {
      'Content-type': 'application/json',
    },
  };

  if (mybody !== null) {
    settings.body = JSON.stringify(mybody);
  }

  if (token !== null) {
    settings.headers.Authorization = `Bearer ${token}`;
  }
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:5005/${path}`, settings)
      .then((res) => {
        if (res.ok) {
          res.json()
            .then(data => {
              resolve(data);
            });
        } else {
          res.json()
            .then(e => {
              reject(e.error);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      })
  });
}
// refer ass2 helper function
export function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}
// @param date string
// return formatted string
export function myDateFormat (date) {
  const currDate = new Date(date);
  const year = currDate.getFullYear();
  const month = currDate.getMonth() + 1;
  const day = currDate.getDate();
  return year + '-' + month + '-' + day;
}
// @param start date obj
// @apram end date obj
// return integer
export function getDaysBetween (startDate, endDate) {
  return parseInt(((endDate - startDate) / (1000 * 3600 * 24) + 1).toString(), 10);
}
// @param array of reviews
//  return average rating
export function getTotalRating (revieArr) {
  let v = 0;
  let counter = 0;
  for (const r of revieArr) {
    v += parseFloat(r.rating);
    counter++;
  }
  return counter === 0 ? 0 : (Math.round(v / counter));
}
// @param string
// return is image or not
export function isBase64 (str) {
  return (str.substring(0, 10) === 'data:image') || str === '';
}
