// tslint:disable
/**
 * ReadMark
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Post } from './post';

/**
 * 
 * @export
 * @interface InlineResponse2002
 */
export interface InlineResponse2002 {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse2002
     */
    Code: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2002
     */
    Msg?: string | null;
    /**
     * 
     * @type {Array<Post>}
     * @memberof InlineResponse2002
     */
    Data: Array<Post>;
}


