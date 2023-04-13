import got from 'got';

const getRelevantData = (objects: any[]) => {
  return objects.map((object) => {
    return {
      name: object?.name,
      total_seconds: object?.total_seconds,
    };
  });
}

export async function GET(request: Request) {
  const wakatimeResp = await fetch(`https://wakatime.com/api/v1/users/current/status_bar/today?api_key=${process.env.WAKATIME_SECRET_KEY}`);
  const { data } = await wakatimeResp.json();

  const relevantData = {
    total: data?.grand_total?.total_seconds,
    languages: getRelevantData(data?.languages),
    projects: getRelevantData(data?.projects),
    date: data?.range?.date,
    timestamp: new Date().getTime()
  }

  await got(
    {
      // ${relevantData.date} add later
      url: `https://personalsite927-default-rtdb.asia-southeast1.firebasedatabase.app/product.json`,
      method: 'POST',
      body: JSON.stringify(relevantData),
    }).json();

  return new Response(JSON.stringify(relevantData))
}
