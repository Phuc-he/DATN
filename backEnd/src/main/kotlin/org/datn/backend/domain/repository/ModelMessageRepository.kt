package org.datn.backend.domain.repository

import kotlinx.coroutines.flow.Flow
import org.datn.backend.domain.entity.Message

interface ModelMessageRepository {
    suspend fun request(message: Message): Message

    suspend fun training(data: List<String>): Flow<String>
}
