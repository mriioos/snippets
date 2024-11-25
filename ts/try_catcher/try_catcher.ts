/**
 * Wrapper funciton for a try-catch block.
 * Helps you escape the 5 lines minimun size of a try-catch hell.
 * @param func Async function to be executed.
 * @returns Array containing both:
 * - The result of a successful try (first element) 
 * - The error of the catch (second element).
 * 
 * Even with all of this crap, I can't still debug those errors for you, sorry. As the profecy tells: One day, all errors will be autodebuged.
 */
async function try_catch(func : () => Promise<any>) : Promise<[any, any]>{
    try{
        const result : Promise<any> = await func();
        return [result, null];
    }
    catch(err : any){
        console.error(err);
        return [null, err];
    }
}