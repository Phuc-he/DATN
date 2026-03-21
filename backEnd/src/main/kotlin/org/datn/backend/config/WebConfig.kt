package org.datn.backend.config

import org.springframework.context.annotation.Configuration
import org.springframework.http.MediaType
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.http.converter.protobuf.ProtobufHttpMessageConverter
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig : WebMvcConfigurer {
    override fun extendMessageConverters(converters: MutableList<HttpMessageConverter<*>>) {
        val protoConverter = ProtobufHttpMessageConverter()

        // Add multiple variations of the media type to the whitelist
        protoConverter.supportedMediaTypes = listOf(
            MediaType("application", "x-protobuf"),
            MediaType("application", "x-protobuf", Charsets.UTF_8),
            MediaType.APPLICATION_OCTET_STREAM // Fallback for raw binary
        )

        converters.add(0, protoConverter)
    }
}