protoc --descriptor_set_out=pbprotocol.protobin --proto_path=..\ --include_imports ..\pbprotocol.proto
protogen pbprotocol.protobin
pause