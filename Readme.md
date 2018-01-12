# NN Ant

# Ant Sensors
Pheremone - Detects scent pheromone released by ants.  Maybe multiple terminals for different pheremones.
Left Eye - Sees light
Right Eye - Sees light
Left Antenna - Feels obstacle
Right Antenna - Feels obstacle 
Left Scent Antenna - Detects smells. May be broken into multiple terminals for certain smell contents.
Right Scent Antenna - Detects smells.

# Ant operations
Rotate left
Rotate Right
Move Forward 
Move Back

Pick up - Picks up object within range of mouth
Drop - Drops object in mouth on ground
Attack - Attack what is in front of it. (This will for an object within the mouth's area.  If there is one it'll call the object's 'getAttacked' function.)

Leave trail - Drops a scent marker of pheromone.
