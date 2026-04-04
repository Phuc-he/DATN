plugins {
    kotlin("jvm") version "2.2.21"
    kotlin("plugin.spring") version "2.2.21"
    id("org.springframework.boot") version "4.0.4"
    id("io.spring.dependency-management") version "1.1.7"
    kotlin("plugin.jpa") version "2.2.21"
    id("com.google.protobuf") version "0.9.4"

//    id("io.gitlab.arturbosch.detekt") version "1.23.6"
    id("org.jlleitschuh.gradle.ktlint") version "12.1.1"
}

group = "org.datn"
version = "0.0.1-SNAPSHOT"
description = "backEnd"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-webmvc")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("tools.jackson.module:jackson-module-kotlin")
    implementation("com.google.protobuf:protobuf-java:4.28.2")
    implementation("com.google.protobuf:protobuf-kotlin:4.28.2")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("com.google.code.gson:gson:2.11.0")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")
    implementation("com.fasterxml.jackson.core:jackson-databind")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    runtimeOnly("com.mysql:mysql-connector-j")
    testImplementation("org.springframework.boot:spring-boot-starter-data-jpa-test")
    testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
//    detektPlugins("io.gitlab.arturbosch.detekt:detekt-rules-libraries:1.23.6")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict", "-Xannotation-default-target=param-property")
    }
}

allOpen {
    annotation("jakarta.persistence.Entity")
    annotation("jakarta.persistence.MappedSuperclass")
    annotation("jakarta.persistence.Embeddable")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

//detekt {
//    buildUponDefaultConfig = true // Sử dụng rule mặc định của Detekt
//    allRules = false // true nếu bạn muốn cực kỳ khắt khe
//    config.setFrom(files("$projectDir/config/detekt/detekt.yml")) // File cấu hình tùy chỉnh
//    baseline = file("$projectDir/config/detekt/baseline.xml")
//}

// --- Cấu hình Ktlint ---
ktlint {
    verbose.set(true)
    outputToConsole.set(true)
    coloredOutput.set(true)
    reporters {
        reporter(org.jlleitschuh.gradle.ktlint.reporter.ReporterType.PLAIN)
        reporter(org.jlleitschuh.gradle.ktlint.reporter.ReporterType.CHECKSTYLE)
    }
    filter {
        exclude { it.file.path.contains("generated") } // Loại bỏ file từ Protobuf
    }
}

// Vô hiệu hóa các task liên quan đến Kotlin Script (.kts)
tasks.named("runKtlintCheckOverKotlinScripts") {
    enabled = false
}
tasks.named("runKtlintFormatOverKotlinScripts") {
    enabled = false
}

sourceSets {
    main {
        proto {
            // Point to the shared folder outside the backend directory
            srcDir("../proto-schema")
        }
    }
}

protobuf {
    protoc {
        artifact = "com.google.protobuf:protoc:4.28.2"
    }
    generateProtoTasks {
        all().forEach { task ->
            task.builtins {
                // Remove id("java") if it causes a conflict,
                // as the plugin usually detects the java plugin automatically.
                // Or, use the following syntax to ensure it's configured correctly:
                java { }
                kotlin { }
            }
        }
    }
}
