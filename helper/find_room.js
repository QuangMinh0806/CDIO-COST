const find_room = (list_room, index, customer, value, result) => {
    if(customer <= 0){
        result.push([...value]);
        return;
    }

    const selectedRoom = new Set(value.map(list_room => list_room.room_detail_id));

    for(let i = index; i < list_room.length; i++) {
        if(!selectedRoom.has(list_room[i].room_detail_id)){
            value.push(list_room[i]);
            find_room(list_room, i, customer - list_room[i].adult_count, value, result);
            value.pop();
        }
    }
}



module.exports = {find_room};