"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fileDescriptorTSD_1 = require("./ts/fileDescriptorTSD");
var ExportMap_1 = require("./ExportMap");
var util_1 = require("./util");
var plugin_pb_1 = require("google-protobuf/google/protobuf/compiler/plugin_pb");
var grpcweb_1 = require("./service/grpcweb");
util_1.withAllStdIn(function (inputBuff) {
    try {
        var typedInputBuff = new Uint8Array(inputBuff.length);
        typedInputBuff.set(inputBuff);
        var codeGenRequest = plugin_pb_1.CodeGeneratorRequest.deserializeBinary(typedInputBuff);
        var codeGenResponse_1 = new plugin_pb_1.CodeGeneratorResponse();
        var exportMap_1 = new ExportMap_1.ExportMap();
        var fileNameToDescriptor_1 = {};
        var generateServices_1 = codeGenRequest.getParameter() === "service=true";
        codeGenRequest.getProtoFileList().forEach(function (protoFileDescriptor) {
            fileNameToDescriptor_1[protoFileDescriptor.getName()] = protoFileDescriptor;
            exportMap_1.addFileDescriptor(protoFileDescriptor);
        });
        codeGenRequest.getFileToGenerateList().forEach(function (fileName) {
            var outputFileName = util_1.replaceProtoSuffix(fileName);
            var thisFile = new plugin_pb_1.CodeGeneratorResponse.File();
            thisFile.setName(outputFileName + ".d.ts");
            thisFile.setContent(fileDescriptorTSD_1.printFileDescriptorTSD(fileNameToDescriptor_1[fileName], exportMap_1));
            codeGenResponse_1.addFile(thisFile);
            if (generateServices_1) {
                grpcweb_1.generateGrpcWebService(outputFileName, fileNameToDescriptor_1[fileName], exportMap_1)
                    .forEach(function (file) { return codeGenResponse_1.addFile(file); });
            }
        });
        process.stdout.write(new Buffer(codeGenResponse_1.serializeBinary()));
    }
    catch (err) {
        console.error("protoc-gen-ts error: " + err.stack + "\n");
        process.exit(1);
    }
});
//# sourceMappingURL=index.js.map