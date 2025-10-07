import {hash, verify} from "argon2";
import {HashProviderInterface} from "../domain/interface/hashProvider.interface";


export default class Argon2HashProvider implements HashProviderInterface {

    hash(payload: string): Promise<string> {
        return hash(payload);
    }

    compare(payload: string, hashed: string): Promise<boolean> {
        return verify(hashed, payload);
    }

}