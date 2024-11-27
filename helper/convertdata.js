const convertData = (data) => {
    const seenKeys = new Set();
    const result = [];

    data.forEach((sublist) => {
        const roomCount = {};

        sublist.forEach((room) => {
            const key = `${room.room_id}_${room.total_price}`;

            if (!roomCount[key]) {
                roomCount[key] = {
                    room_id: room.room_id,
                    room_name: room.room_name,
                    adult_count: room.adult_count,
                    total_price: parseInt(room.total_price, 10),
                    count: 1,
                };
            } else {
                roomCount[key].count += 1;
            }
        });

        const groupedSublist = Object.values(roomCount);

        const key = groupedSublist
            .map(room => `${room.room_id}_${room.total_price}_${room.count}`)
            .sort()
            .join('|');

        if (!seenKeys.has(key)) {
            seenKeys.add(key);
            result.push(groupedSublist);
        }
    });

    return result;
};

module.exports = { convertData };
