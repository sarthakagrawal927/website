import got from 'got';

const getRelevantData = (objects: any[]) => {
  if (!objects) return [];
  return objects.map((object) => {
    return {
      name: object?.name,
      total_seconds: object?.total_seconds,
    };
  });
}

export async function POST(request: Request) {
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
      url: `${process.env.FIREBASE_URL}/product/${relevantData.date}.json`,
      method: 'POST',
      body: JSON.stringify(relevantData),
    }).json();

  return new Response(JSON.stringify(relevantData))
}
