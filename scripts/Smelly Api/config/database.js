/*
|--------------------------------------------------------------------------
| Max Databse string size
|--------------------------------------------------------------------------
|
| Here is the max database save size meaing when a save gets made
| it tests the size of that save and splits up the save depending on this
| Size. Its releated to minecrafts 32k bit limit.
|
*/
export const MAX_DATABASE_STRING_SIZE = 32000;

/*
|--------------------------------------------------------------------------
| Max Dynamic property size
|--------------------------------------------------------------------------
|
| This is thje max size a dynamic string property can be 
| Setting this allows us to split up the data and know the max length
| Its a relation to memory transfer size
|
*/
export const MAX_DYNAMIC_PROPERTY_SIZE = 4294967295;
