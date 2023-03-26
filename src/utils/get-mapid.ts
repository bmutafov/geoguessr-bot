import { geoGuessrClient } from './axios-instance';

type MapSearchItem = {
	id: string;
	name: string;
};

function getMapSearchUrl(mapName: string) {
	return `/api/v3/search/any?page=0&count=1&q=${mapName}`;
}

export default async function getMapId(mapName: string) {
	const { data } = await geoGuessrClient<MapSearchItem[]>(getMapSearchUrl(mapName));
	if (data.length === 0) return null;
	return data[0].id;
}
