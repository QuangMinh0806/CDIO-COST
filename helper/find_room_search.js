const find_room_search = (data, index, customer, value, result) => {
    const list_room = data.room_empty;
    if(customer <= 0){
        result.push({
            hotel_name: data.hotel_name,
            rooms: [...value],
        });
        return;
    }

    const selectedRoom = new Set(value.map(room => room.room_detail_id));

    for (let i = index; i < list_room.length; i++) {
        if (!selectedRoom.has(list_room[i].room_detail_id) && list_room[i].adult_count <= customer) {
            value.push(list_room[i]);
            find_room_search(data, i + 1, customer - list_room[i].adult_count, value, result); 
            value.pop();
        }
    }
}

const find_room_hotel = (data, customer) =>{
    const result = [];
    for (let hotelData of data) {
        find_room_search(hotelData, 0, customer, [], result); 
    }
    return result;
}


module.exports = {find_room_hotel};