export type Headers = {
    'X-Requested-With': string,
    'Content-Type': string,
    'version'?: string,
}
export type Method =
    | 'get' | 'GET'
    | 'post' | 'POST'

export type ResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream'
