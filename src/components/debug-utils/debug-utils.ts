// tslint:disable: no-console
const todo = ( msg: string) => {
    console.log( "%c %s %s %s ", "color: yellow; background-color: black;", "--", msg, "--");
};

const important = ( msg: string) => {
    console.log( "%c%s %s %s", "color: brown; font-weight: bold; text-decoration: underline;", "--", msg, "--");
};

const debug = ( msg: string, infos?: any) => {
    console.log( "%c %s %s %s ", "color: blue;", "--", msg, "--");
    if (infos) {console.log( infos ); }
};

export {todo, important, debug};
